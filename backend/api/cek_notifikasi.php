<?php
// File: backend/api/cek_notifikasi.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Cek sepatu yang harga jualnya 0 atau NULL
$query = "SELECT COUNT(*) as jumlah FROM sepatu WHERE harga_jual IS NULL OR harga_jual = 0";
$stmt = $db->prepare($query);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$jumlah_kosong = $row['jumlah'];

echo json_encode([
    "status" => "success",
    "jumlah_belum_diharga" => $jumlah_kosong,
    "pesan" => $jumlah_kosong > 0 ? "Ada $jumlah_kosong barang belum dikasih harga!" : "Aman"
]);
?>