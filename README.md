# AsyncAPI Playground

![](screenshot.png)

## Using it locally

Run:

```
npm install
```

and

```
npm start
```

and go to [http://localhost:5000]().

## Build docker image

```
docker build -t asyncapi-playground .
```

## Run docker image

```
docker run -d --name asyncapi-playground -p 83:5000 asyncapi-playground:latest
```

Then browse to [http://localhost:83/]()

## Load async api

2 ways to load async apis from an url: 

- Use the *load* parameter.

```
https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/asyncapi/asyncapi/master/examples/2.0.0/simple.yml
```

- Use the *url* parameter.
```
https://playground.asyncapi.io/?url=https://raw.githubusercontent.com/asyncapi/asyncapi/master/examples/2.0.0/simple.yml
```

