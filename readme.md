# Scrape API

## Initialize (create) new scrape

`POST /scrape/init`
```
{
    target: "nab"|"qantasff"
    username: string
    password: string
    <other>?: string
}
```
Successful login response:
```
{
    context: string
    data: any[]
}
```
Unsuccessful login response:
```
{
    error: string
    description?: string
}
```

## Retrieve accounts

`GET /scrape/accounts?context={context}`

*If context is unavailable, 404 response will be sent.*

## Logout

`GET /scrape/logout?context={context}`

*If context is unavailable, 404 response will be sent.*



# Control API

## List current contexts

`GET /control/contexts`

Successful response:
```
{
    id: string
    created: Date
    lastUsed: Date
    scraper: string
}
```

## Retrieve target context log

`GET /control/log?context={context}`

Successful response:
```
{
    created: Date
    text: string
    data: string
    type: "text"|"image/png"
}[]
```