<?php
// File: backend/api/cek_stok.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Tentukan batas stok dianggap "menipis"
$batas_min = 5;

// Hitung berapa banyak item (per ukuran) yang stoknya di bawah batas
$query = "SELECT count(*) as jumlah FROM stok WHERE jumlah < :batas AND jumlah > 0";
$stmt = $db->prepare($query);
$stmt->bindParam(":batas", $batas_min);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$jumlah_tipis = $row['jumlah'];

echo json_encode([
    "status" => "success",
    "jumlah_stok_tipis" => $jumlah_tipis,
    "pesan" => $jumlah_tipis > 0 ? "Ada barang hampir habis!" : "Stok aman"
]);
?>