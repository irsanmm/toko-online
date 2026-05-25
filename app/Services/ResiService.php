<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ResiService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.binderbyte.com/v1';

    // Kurir yang didukung Binderbyte
    public static array $kurirList = [
        'jne'      => 'JNE',
        'jnt'      => 'J&T Express',
        'sicepat'  => 'SiCepat',
        'anteraja' => 'AnterAja',
        'pos'      => 'Pos Indonesia',
        'tiki'     => 'TIKI',
        'ninja'    => 'Ninja Express',
        'lion'     => 'Lion Parcel',
        'idexpress'=> 'ID Express',
        'sap'      => 'SAP Express',
    ];

    public function __construct()
    {
        $this->apiKey = config('services.binderbyte.key');
    }

    /**
     * Tracking resi dari Binderbyte API
     * @param string $kurir  — kode kurir (jne, jnt, dll)
     * @param string $resi   — nomor resi
     * @return array
     */
    public function track(string $kurir, string $resi): array
    {
        try {
            $response = Http::timeout(15)->get("{$this->baseUrl}/track", [
                'api_key' => $this->apiKey,
                'courier' => strtolower($kurir),
                'awb'     => $resi,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                // Binderbyte mengembalikan status 200 tapi bisa ada error di body
                if (isset($data['status']) && $data['status'] == 200) {
                    return [
                        'success' => true,
                        'data'    => $this->formatTracking($data['data'], $kurir),
                    ];
                }

                return [
                    'success' => false,
                    'message' => $data['message'] ?? 'Resi tidak ditemukan.',
                ];
            }

            return ['success' => false, 'message' => 'Gagal menghubungi server tracking.'];

        } catch (\Exception $e) {
            Log::error('ResiService error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan saat tracking resi.'];
        }
    }

    /**
     * Format data dari Binderbyte ke format yang dipakai frontend
     */
    private function formatTracking(array $data, string $kurir): array
    {
        $summary = $data['summary'] ?? [];
        $history = $data['history'] ?? [];

        return [
            'kurir'        => self::$kurirList[$kurir] ?? strtoupper($kurir),
            'kode_kurir'   => $kurir,
            'nomor_resi'   => $summary['awb'] ?? '',
            'status'       => $summary['status'] ?? '',
            'pengirim'     => $summary['shipper'] ?? '-',
            'penerima'     => $summary['receiver'] ?? '-',
            'asal'         => $summary['origin'] ?? '-',
            'tujuan'       => $summary['destination'] ?? '-',
            'berat'        => $summary['weight'] ?? '-',
            'layanan'      => $summary['service'] ?? '-',
            'terakhir_di'  => $history[0]['description'] ?? '-',
            'riwayat'      => array_map(fn($h) => [
                'tanggal'     => $h['date'] ?? '',
                'deskripsi'   => $h['description'] ?? '',
                'lokasi'      => $h['location'] ?? '',
            ], $history),
        ];
    }

    /**
     * Cek apakah API key sudah dikonfigurasi
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey) && $this->apiKey !== 'your-binderbyte-api-key';
    }
}