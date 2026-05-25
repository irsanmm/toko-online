<?php
// ============================================================
// SIMPAN DI  : config/services.php
// TIMPA FILE : yang lama — tambahkan 'binderbyte' di bagian bawah
// ============================================================

return [

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // === BINDERBYTE API untuk tracking resi ===
    'binderbyte' => [
        'key' => env('BINDERBYTE_API_KEY', ''),
    ],

];