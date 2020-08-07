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

and go to [http://localhost:5000](http://localhost:5000).

## Build docker image

```
docker build -t asyncapi-playground .
```

## Run docker image

```
docker run -d --name asyncapi-playground -p 83:5000 asyncapi-playground:latest
```

Then browse to [http://localhost:83](http://localhost:83)

## Preloading

There are two options to open a specific asyncapi spec:

#### 1. `load` query parameter

Open the playground with the `load` query parameter set to the URL the app should load on start.

Example:

```
http://localhost:5000/?load=http://my.doma.in/spec.yaml
```


#### 2. `DEFAULT_SPEC_URL` environment variable

Set the environment variable `DEFAULT_SPEC_URL` either before running `npm start` in command line or as a docker environment variable. The spec available on the given URL will be loaded when the app is opened.

Example:

```sh
# with npm in CLI
DEFAULT_SPEC_URL=http://my.doma.in/spec.yaml npm start

# with docker
docker run -d --name asyncapi-playground -p 83:5000 --env DEFAULT_SPEC_URL=http://my.doma.in/spec.yaml asyncapi-playground:latest
```
