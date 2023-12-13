<p align="center">Simple Next.js Incident Reporter that uses <a href="https://fastapi.tiangolo.com/">FastAPI</a> as the API backend.</p>

<br/>

## Introduction

This is a hybrid Next.js + Python app that uses Next.js as the frontend and FastAPI as the API backend. One great use case of this is to write Next.js apps that use Python AI libraries on the backend.This system is used for basic cybersecurity incident reporting. And also this system allows organizations to report cybersecurity incidents and view a list of reported incidents.

## How It Works

The Python/FastAPI server is mapped into to Next.js app under `/api/`.

On localhost, the server will be made to the `127.0.0.1:8000` port, which is where the FastAPI server is running.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The FastApi server will be running on [http://127.0.0.1:8000](http://127.0.0.1:8000) – feel free to change the port in `package.json`.
