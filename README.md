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

## URL query parameters:

- **load** - load the external AsyncAPI spec:

```
https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/asyncapi/asyncapi/master/examples/2.0.0/simple.yml
```

- **url** - this same purpose as **load**:

```
https://playground.asyncapi.io/?url=https://raw.githubusercontent.com/asyncapi/asyncapi/master/examples/2.0.0/simple.yml
```

- **template** - show given template. Allowed values are `markdown` and `html`:

```
https://playground.asyncapi.io/?template=markdown
```

- **readOnly** - show only rendered template. Allowed values are `true` and empty string:

```
https://playground.asyncapi.io/?readOnly
```