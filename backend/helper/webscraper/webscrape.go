package webscraper

import (
	"context"
	"fmt"
	"log"
	"math/rand/v2"
	"moviefy/main/helper/neshto"
	"strings"
	"sync"
	"time"

	"github.com/gocolly/colly"
	"github.com/gocolly/colly/extensions"
	"github.com/jackc/pgx/v5"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
var C CollyCollector

type SingleFilmDetails struct {
	ID        string
	PosterURL string
	PlotText  string
	Error     error
}

type CollyCollector struct {
	*colly.Collector

	wg               map[string]*sync.WaitGroup
	mu               sync.RWMutex
	ResultsSearch    map[string]map[string]*neshto.SearchMovie
	ResultSingleFilm map[string]*SingleFilmDetails
}

func randString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.IntN(len(letters))]
	}
	return string(b)
}

func (c *CollyCollector) InitCollector() {
	c.Collector = colly.NewCollector(
		colly.Async(true),
	)

	c.wg = make(map[string]*sync.WaitGroup)
	c.ResultsSearch = make(map[string]map[string]*neshto.SearchMovie)
	c.ResultSingleFilm = make(map[string]*SingleFilmDetails)

	c.Limit(&colly.LimitRule{
		DomainGlob:  "*",
		Parallelism: 20,
		Delay:       time.Millisecond * 50,
		RandomDelay: time.Millisecond * 25,
	})

	extensions.RandomUserAgent(c.Collector)

	c.setupHandlers()

	c.OnRequest(func(r *colly.Request) {
		if r.URL.Host != "" {
			r.Headers.Set("Origin", fmt.Sprintf("https://%s", r.URL.Host))
		}

		r.Headers.Set("Sec-Fetch-Site", "same-origin")
		r.Headers.Set("Sec-Fetch-Mode", "cors")
		r.Headers.Set("Sec-Fetch-Dest", "empty")

		r.Headers.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7")
		r.Headers.Set("Accept-Language", "en-US,en;q=0.9")
		r.Headers.Set("Accept-Encoding", "gzip, deflate, br")

		r.Headers.Set("Connection", "keep-alive")
		r.Headers.Set("Cache-Control", "no-cache")
		r.Headers.Set("Pragma", "no-cache")

		r.Headers.Set("Sec-Fetch-Dest", "document")
		r.Headers.Set("Sec-Fetch-Mode", "navigate")
		r.Headers.Set("Sec-Fetch-Site", "none")
		r.Headers.Set("Sec-Fetch-User", "?1")
		r.Headers.Set("Sec-Ch-Ua", `"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"`)
		r.Headers.Set("Sec-Ch-Ua-Mobile", "?0")
		r.Headers.Set("Sec-Ch-Ua-Platform", `"Windows"`)

		r.Headers.Set("Upgrade-Insecure-Requests", "1")

		if rand.Float32() < 0.7 {
			possibleReferers := []string{
				"https://www.google.com/",
				"https://www.bing.com/",
				"https://duckduckgo.com/",
				"https://www.reddit.com/",
				"https://news.ycombinator.com/",
			}
			r.Headers.Set("Referer", possibleReferers[rand.IntN(len(possibleReferers))])
		}
	})
	c.OnResponse(func(r *colly.Response) {

		if r.StatusCode == 403 || r.StatusCode == 429 {
			fmt.Printf("Possible bot detection: %d\n", r.StatusCode)
			time.Sleep(time.Duration(rand.IntN(30)+30) * time.Second)
		}

	})

	c.SetRequestTimeout(10 * time.Second)
}

func (c *CollyCollector) setupHandlers() {

	//
	// 		ScrapeSingleFilmDetails
	//

	c.OnHTML("div[data-testid='hero-media__poster'] a", func(e *colly.HTMLElement) {
		pageUrl := e.Request.URL.String()
		urlArr := strings.FieldsFunc(pageUrl, func(SRune rune) bool { return SRune == '/' })
		if len(urlArr) < 5 {
			fmt.Println("urlArr : ", urlArr)
			return
		}
		id := urlArr[4]
		secret := e.Request.URL.Query().Get("secret")

		href := e.Attr("href")

		if href != "" && strings.Contains(href, "/mediaviewer/") {
			posterURL := "https://www.imdb.com" + href
			if secret != "" {
				posterURL = posterURL + "/?secret=" + secret
			}

			err := c.Visit(posterURL)

			if err != nil {
				c.mu.Lock()
				if c.ResultSingleFilm[id] != nil {
					c.ResultSingleFilm[id].Error = fmt.Errorf("failed to visit media viewer page : %v", err)
				}
				c.mu.Unlock()
			}

		}
	})

	c.OnHTML("div[data-testid='media-viewer']", func(e *colly.HTMLElement) {
		pageUrl := e.Request.URL.String()
		urlArr := strings.FieldsFunc(pageUrl, func(SRune rune) bool { return SRune == '/' })
		if len(urlArr) < 5 {
			fmt.Println("urlArr : ", urlArr)
			return
		}
		id := urlArr[4]
		secret := e.Request.URL.Query().Get("secret")

		firstImg := e.DOM.Find("img").First()

		src, _ := firstImg.Attr("src")
		if src != "" && strings.Contains(src, "https://m.media-amazon.com") {
			c.mu.Lock()
			if secret != "" {
				if secretMap, exists := c.ResultsSearch[secret]; exists {
					if movie, exists := secretMap[id]; exists && movie != nil {

						movie.PosterUrl = &src
						c.mu.Unlock()
						if wg, exists := c.wg[secret]; exists && wg != nil {
							wg.Done()

						}
					} else {
						c.mu.Unlock()
					}
				} else {
					c.mu.Unlock()
				}
			} else {
				if film, exists := c.ResultSingleFilm[id]; exists && film != nil {
					film.PosterURL = src
					c.mu.Unlock()
					if wg, exists := c.wg[id]; exists && wg != nil {
						wg.Done()
					}
				} else {
					c.mu.Unlock()
				}
			}
		}
	})

	c.OnHTML("p[data-testid='plot'] span:last-child", func(e *colly.HTMLElement) {
		pageUrl := e.Request.URL.String()
		urlArr := strings.FieldsFunc(pageUrl, func(SRune rune) bool { return SRune == '/' })
		if len(urlArr) < 5 {
			fmt.Println("urlArr : ", urlArr)
			return
		}
		id := urlArr[4]

		if len(urlArr) < 6 || urlArr[5] != "mediaviewer" {
			return
		}

		plotText := e.Text

		c.mu.Lock()
		if film, exists := c.ResultSingleFilm[id]; exists && film != nil {
			film.PlotText = plotText
		}
		c.mu.Unlock()
	})

	c.OnError(func(r *colly.Response, err error) {
		pageUrl := r.Request.URL.String()
		urlArr := strings.FieldsFunc(pageUrl, func(SRune rune) bool { return SRune == '/' })
		if len(urlArr) < 5 {
			fmt.Println("errrrrrrrrrror ")
			fmt.Println("urlArr : ", urlArr)
			return
		}
		id := urlArr[4]

		c.mu.Lock()
		if film, exists := c.ResultSingleFilm[id]; exists && film != nil {
			film.Error = fmt.Errorf("got the error %v: ", err)
		}
		c.mu.Unlock()

		log.Println("Got the error : ", err)
	})
}

func (c *CollyCollector) ScrapeSingleFilmDetails(id string) (*SingleFilmDetails, error) {
	result := &SingleFilmDetails{
		ID: id,
	}

	c.wg[id] = &sync.WaitGroup{}
	c.ResultSingleFilm[id] = result

	mainURL := "https://www.imdb.com/title/" + id + "/"

	err := c.Visit(mainURL)
	if err != nil {
		return nil, fmt.Errorf("failed to visit main URL: %v ", err)
	}

	c.wg[id].Wait()

	neshto.MovieDB.Exec(context.Background(), `
		UPDATE posters
		SET posterId = $1,
		description = $2
		WHERE titleId = $3`, c.ResultSingleFilm[id].PosterURL, c.ResultSingleFilm[id].PlotText, id)

	delete(c.ResultSingleFilm, id)
	delete(c.wg, id)

	return result, result.Error
}

func (c *CollyCollector) ScrapeSearchResultDetails(searchItems *[]*neshto.SearchMovie) error {
	var SearchUndetailedResults = make(map[string]*neshto.SearchMovie)
	for _, item := range *searchItems {
		if item.PosterUrl == nil {
			SearchUndetailedResults[item.Id] = item
		}
	}

	randomId := randString(14)
	c.ResultsSearch[randomId] = SearchUndetailedResults
	c.wg[randomId] = &sync.WaitGroup{}
	baseURL := "https://www.imdb.com/title/"

	for _, item := range SearchUndetailedResults {
		c.wg[randomId].Add(1)
		c.Visit(baseURL + item.Id + "/?secret=" + randomId)
	}

	c.wg[randomId].Wait()

	err := bulkUpdateFilms(searchItems, SearchUndetailedResults)
	if err != nil {
		fmt.Println(err)
		return err
	}

	delete(c.wg, randomId)
	delete(c.ResultsSearch, randomId)

	return nil
}

func bulkUpdateFilms(searchItems *[]*neshto.SearchMovie, SearchUndetailedResults map[string]*neshto.SearchMovie) error {
	ctx := context.Background()
	tx, err := neshto.MovieDB.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for i, item := range *searchItems {
		newItem, exists := SearchUndetailedResults[item.Id]
		if !exists {
			continue
		}

		if item.PosterUrl != newItem.PosterUrl {
			(*searchItems)[i] = SearchUndetailedResults[item.Id]
			_, err := tx.Exec(ctx, `
				UPDATE posters 
				SET posterId = $1
				WHERE titleId = $2
				`, SearchUndetailedResults[item.Id].PosterUrl, item.Id)
			if err != nil {
				return err
			}
		}
	}
	tx.Commit(context.Background())
	return nil
}

// should handle the caching of the posterURLS and the descriptions
