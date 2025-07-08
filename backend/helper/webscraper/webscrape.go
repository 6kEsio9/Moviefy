package webscraper

import (
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/gocolly/colly"
)

type SingleFilmDetails struct {
	ID        string
	PosterURL string
	PlotText  string
	Error     error
}

func ScrapeSingleFilmDetails(id string) (*SingleFilmDetails, error) {
	result := &SingleFilmDetails{
		ID: id,
	}

	var wait = make(chan string)
	var mu sync.Mutex

	c := colly.NewCollector()

	mainURL := "https://www.imdb.com/title/" + id + "/"

	log.Println("Visiting main page : ", mainURL)

	c.OnHTML("div[data-testid='hero-media__poster'] a", func(e *colly.HTMLElement) {
		href := e.Attr("href")

		if href != "" && strings.Contains(href, "/mediaviewer/") {
			posterURL := "https://www.imdb.com" + href

			go func() {
				c.OnHTML("div[data-testid='media-viewer'] img", func(e *colly.HTMLElement) {
					firstImg := e.DOM.Find("img").First()
					src, _ := firstImg.Attr("src")
					if src != "" && strings.Contains(src, "https://m.media-amazon.com") {
						result.PosterURL = src
					}
					wait <- "found"
				})
				err := c.Visit(posterURL)
				if err != nil {
					mu.Lock()
					result.Error = fmt.Errorf("failed to visit media viewer page : %v", err)
					mu.Unlock()
				}

			}()
		}
	})

	c.OnHTML("p[data-testid='plot'] span:last-child", func(e *colly.HTMLElement) {
		plotText := e.Text

		result.PlotText = plotText
	})

	c.OnError(func(r *colly.Response, err error) {
		mu.Lock()
		result.Error = fmt.Errorf("got the error %v: ", err)
		mu.Unlock()
		log.Println("Got the error : ", err)
	})

	err := c.Visit(mainURL)
	if err != nil {
		return nil, fmt.Errorf("failed to visit main URL: %v ", err)
	}

	<-wait

	return result, result.Error
}

// should add a func to get posterURLs for an array of ids
// should handle the caching of the posterURLS and the descriptions
