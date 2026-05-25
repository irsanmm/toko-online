<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {{-- CSRF Token — WAJIB ada agar fetch() dari React bisa POST --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>AMENG STORE</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>