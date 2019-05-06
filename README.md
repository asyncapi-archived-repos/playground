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

