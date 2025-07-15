# !/bin/bash
#awk -F',' 'BEGIN{OFS=","} $1=="\"imdbmovie\"" {print $2,$3}' db\ tsv\ files/movie_links.csv

tail -n +2 "db tsv files/movie_abstracts.csv" | awk -F',' '
{
    text = $2
    for (i = 3; i <= NF; i++) {
        text = text "," $i
    }
    print $1 "\t" text
}' | awk -F',' 'NF==2 {print}'
