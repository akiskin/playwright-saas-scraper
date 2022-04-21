# Scrape API

## Initialize (create) New Scrape

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

## Retrieve Accounts

`GET /scrape/accounts?context={context}`

*If context is unavailable, 404 response will be sent.*

## Logout

`GET /scrape/logout?context={context}`

*If context is unavailable, 404 response will be sent.*



# Control API

## List Existing Contexts

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

## Destroy Context

`DELETE /control/contexts/{context_id}`

*If context is unavailable, 404 response will be sent.*


## Trigger Expired Contexts Removal

`POST /control/contexts/destroy/old`

Successful response:
```
{
    destroyed: number
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