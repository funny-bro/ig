# wiki image scraper

## Run Single 
```
$ node script/google.art.scraper/provider --rootUrl=https://artsandculture.google.com/asset/continental-map-with-scenes-of-forty-eight-foreign-people-america-and-europe/OwEFZanvO9DDdg
```



## Run List 
```
$ node script/google.art.scraper/provider --listFile=./googleart.list.json 
```

`./googleart.list.json `
```
[
  "https://artsandculture.google.com/asset/continental-map-with-scenes-of-forty-eight-foreign-people-america-and-europe/OwEFZanvO9DDdg",
  "https://artsandculture.google.com/asset/the-5th-competitive-exhibition-fukuoka-prefecture-sponsored-by-the-federation-of-kyushu-and-okinawa/5QF7pq5BcR1VPA"
]
```

## Run consumer
```
$ node script/google.art.scraper/consumer.js --projectName=KawaharaKeiga

```