#!/bin/bash
# KULLANICININ ORİJİNAL VERİLERİNİ YÜKLE
# Bu script her zaman orijinal verileri yükler

echo "========================================"
echo "ORİJİNAL VERİLER YÜKLENİYOR..."
echo "========================================"

cd /app/backend

# Tüm verileri yükle
python3 load_data.py
python3 load_additional_data.py
python3 ORIGINAL_USER_DATA.py

echo ""
echo "========================================"
echo "✅ TÜM ORİJİNAL VERİLER YÜKLENDİ!"
echo "========================================"
