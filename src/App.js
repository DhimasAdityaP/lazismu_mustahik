import React, { useState, useMemo } from 'react';
import { supabase } from './supabaseClient'; // Pastikan Anda mengimpor supabase dengan benar
import bgImage from './bg.png';

const App = () => {
    const [formData, setFormData] = useState({
        tanggal_survey: '',
        petugas_survey: 'Admin',
        nama_mustahik: '',
        bantuan_diajukan: '', 
        jumlah_tanggungan: 0,
        jumlah_anak_sekolah: 0,
        jumlah_anak_putus_sekolah: 0,
        pengeluaran_bulanan: 0,
        obat_rutin: 0,
        biaya_pendidikan: 0,
        riwayat_hutang: false, // Ubah menjadi boolean
        keperluan_hutang: '',
        pekerjaan_kepala_keluarga: '',
        pekerjaan_suami_istri: '',
        usia_mustahik: 0,
        kondisi_kepala_keluarga: '',
        kepemilikan_rumah: '',
        luas_rumah: '',
        dinding_rumah: '',
        lantai_rumah: '',
        atap_rumah: '',
        sumber_air: '',
        mck: '',
        penerangan: '',
        listrik_terpasang: '',
        kelayakan_tidur: '',
        belanja_harian: 0,
        aset_tidak_bergerak: '',
        aset_bergerak: '',
        status_bantuan: '',
        jenis_bantuan: '',
        frekuensi_bantuan: '',
        bantuan_yang_diterima: '',
        rencana_tindak_lanjut: '',
    });

    // Fungsi untuk menghitung total skor
    const calculateTotalScore = () => {
        let totalScore = 0; // Inisialisasi sebagai angka

        // 1. Jumlah Tanggungan
        if (formData.jumlah_tanggungan > 7) {
            totalScore += 5;
        } else if (formData.jumlah_tanggungan >= 4 && formData.jumlah_tanggungan <= 6) {
            totalScore += 4;
        } else if (formData.jumlah_tanggungan >= 2 && formData.jumlah_tanggungan <= 3) {
            totalScore += 3;
        } else if (formData.jumlah_tanggungan === 1) {
            totalScore += 2;
        } else {
            totalScore += 1;
        }

        // 2. Jumlah Anak Sekolah
        if (formData.jumlah_anak_sekolah === 4) {
            totalScore += 5;
        } else if (formData.jumlah_anak_sekolah >= 5 && formData.jumlah_anak_sekolah <= 6) {
            totalScore += 4;
        } else if (formData.jumlah_anak_sekolah >= 2 && formData.jumlah_anak_sekolah <= 3) {
            totalScore += 3;
        } else if (formData.jumlah_anak_sekolah === 1) {
            totalScore += 2;
        } else {
            totalScore += 1;
        }

        // 3. Jumlah Anak Putus Sekolah
        totalScore += formData.jumlah_anak_putus_sekolah > 0 ? 5 : 1;

        // 4. Pengeluaran Bulanan
        if (formData.pengeluaran_bulanan > 3000000) {
            totalScore += 1;
        } else if (formData.pengeluaran_bulanan > 2000000) {
            totalScore += 2;
        } else if (formData.pengeluaran_bulanan > 1000000) {
            totalScore += 3;
        } else if (formData.pengeluaran_bulanan > 500000) {
            totalScore += 4;
        } else if (formData.pengeluaran_bulanan > 250000) {
            totalScore += 5;
        } else {
            totalScore += 6;
        }

        // 5. Obat Rutin
        if (formData.obat_rutin > 1000000) {
            totalScore += 5;
        } else if (formData.obat_rutin >= 500000) {
            totalScore += 4;
        } else if (formData.obat_rutin >= 300000) {
            totalScore += 3;
        } else if (formData.obat_rutin < 200000) {
            totalScore += 2;
        }

        // 6. Biaya Pendidikan
        if (formData.biaya_pendidikan > 2000000) {
            totalScore += 5;
        } else if (formData.biaya_pendidikan > 1500000) {
            totalScore += 4;
        } else if (formData.biaya_pendidikan > 1000000) {
            totalScore += 1;
        } else if (formData.biaya_pendidikan > 500000) {
            totalScore += 3;
        } else if (formData.biaya_pendidikan > 250000) {
            totalScore += 2;
        } else {
            totalScore += 1;
        }

        // 7. Riwayat Hutang
        totalScore += formData.riwayat_hutang ? 5 : 1;

        // 8. Keperluan Hutang
        switch (formData.keperluan_hutang) {
            case 'kebutuhan hidup': totalScore += 5; break;
            case 'biaya kesehatan': totalScore += 4; break;
            case 'biaya pendidikan': totalScore += 3; break;
            case 'kebutuhan sosial': totalScore += 2; break;
            case 'kebutuhan sekunder':
            case 'tidak ada': totalScore += 1; break;
            default: break;
        }

        // 9. Pekerjaan Kepala Keluarga
        switch (formData.pekerjaan_kepala_keluarga) {
            case 'PNS': totalScore += 1; break;
            case 'dagang': totalScore += 2; break;
            case 'karyawan': totalScore += 3; break;
            case 'serabutan': totalScore += 4; break;
            case 'menganggur': totalScore += 5; break;
            default: break;
        }

        // 10. Merokok
        // Asumsi `merokok` adalah boolean
        totalScore += formData.merokok ? 1 : 5;

        // 11. Pekerjaan Suami/Istri
        switch (formData.pekerjaan_suami_istri) {
            case 'PNS': totalScore += 1; break;
            case 'dagang': totalScore += 2; break;
            case 'karyawan': totalScore += 3; break;
            case 'serabutan': totalScore += 4; break;
            case 'menganggur': totalScore += 5; break;
            default: break;
        }

        // 12. Usia Mustahik
        if (formData.usia_mustahik > 50) {
            totalScore += 5;
        } else if (formData.usia_mustahik >= 40) {
            totalScore += 4;
        } else if (formData.usia_mustahik >= 30) {
            totalScore += 3;
        } else if (formData.usia_mustahik >= 20) {
            totalScore += 2;
        } else {
            totalScore += 1;
        }

        // 13. Kondisi Kepala Keluarga
        switch (formData.kondisi_kepala_keluarga) {
            case 'sakit menahun': totalScore += 5; break;
            case 'sakit-sakitan': totalScore += 4; break;
            case 'manula': totalScore += 3; break;
            case 'sehat dan tidak kerja': totalScore += 2; break;
            case 'sehat dan kerja': totalScore += 1; break;
            default: break;
        }

        // 14. Kepemilikan Rumah
        switch (formData.kepemilikan_rumah) {
            case 'menumpang': totalScore += 5; break;
            case 'kontrak': totalScore += 4; break;
            case 'keluarga': totalScore += 3; break;
            case 'sendiri': totalScore += 1; break;
            default: break;
        }

        // 15. Luas Rumah
        if (formData.luas_rumah === 'Sangat kecil') {
            totalScore += 5;
        } else if (formData.luas_rumah === '3×3 m') {
            totalScore += 4;
        } else if (formData.luas_rumah === '4×6 m') {
            totalScore += 3;
        } else {
            totalScore += 1;
        }

        // 16. Dinding Rumah
        switch (formData.dinding_rumah) {
            case 'bambu': totalScore += 5; break;
            case 'seng': totalScore += 4; break;
            case 'kalsibot': totalScore += 3; break;
            case 'semi tembok': totalScore += 2; break;
            case 'batu bata': totalScore += 1; break;
            default: break;
        }

        // 17. Lantai Rumah
        switch (formData.lantai_rumah) {
            case 'tanah': totalScore += 5; break;
            case 'panggung': totalScore += 4; break;
            case 'semen': totalScore += 3; break;
            case 'keramik': totalScore += 1; break;
            default: break;
        }

        // 18. Atap Rumah
        switch (formData.atap_rumah) {
            case 'rumbia': totalScore += 5; break;
            case 'seng': totalScore += 4; break;
            case 'asbes': totalScore += 3; break;
            case 'genteng': totalScore += 1; break;
            default: break;
        }

        // 19. Sumber Air
        switch (formData.sumber_air) {
            case 'tidak ada': totalScore += 5; break;
            case 'bersama': totalScore += 4; break;
            case 'sumur gali': totalScore += 3; break;
            case 'PDAM': totalScore += 2; break;
            case 'sumur bor': totalScore += 1; break;
            default: break;
        }

        // 20. MCK
        switch (formData.mck) {
            case 'tidak ada': totalScore += 5; break;
            case 'bersama': totalScore += 4; break;
            case 'sendiri': totalScore += 1; break;
            default: break;
        }

        // 21. Penerangan
        switch (formData.penerangan) {
            case 'genset': totalScore += 1; break;
            case 'pln': totalScore += 2; break;
            case 'saluran': totalScore += 3; break;
            case 'sentir/lilin': totalScore += 5; break;
            default: break;
        }

        // 22. Listrik Terpasang
        if (formData.listrik_terpasang === '1300kwh') {
            totalScore += 1;
        } else if (formData.listrik_terpasang === '900kwh') {
            totalScore += 2;
        } else if (formData.listrik_terpasang === '450kwh') {
            totalScore += 3;
        } else {
            totalScore += 5;
        }

        // 23. Kelayakan Tidur
        switch (formData.kelayakan_tidur) {
            case 'spring bed': totalScore += 1; break;
            case 'kasur busa': totalScore += 2; break;
            case 'kasur kapuk': totalScore += 3; break;
            case 'tikar/karpet': totalScore += 5; break;
            default: break;
        }
        // 28. Belanja Harian
        if (formData.belanja_harian > 100000) {
            totalScore += 1;
        } else if (formData.belanja_harian >= 50000) {
            totalScore += 2;
        } else if (formData.belanja_harian >= 25000) {
            totalScore += 3;
        } else if (formData.belanja_harian >= 15000) {
            totalScore += 4;
        } else {
            totalScore += 5;
        }

        // 29. Aset Tidak Bergerak
        if (formData.aset_tidak_bergerak === 'tidak punya') {
            totalScore += 5;
        } else if (formData.aset_tidak_bergerak === 'kurang dari 500m²') {
            totalScore += 4;
        } else {
            totalScore += 2;
        }

        // 30. Aset Bergerak
        switch (formData.aset_bergerak) {
            case 'mobil': totalScore += 1; break;
            case 'motor': totalScore += 2; break;
            case 'sepeda': totalScore += 4; break;
            case 'tidak punya': totalScore += 5; break;
            default: break;
        }

        // 31. Status Bantuan
        switch (formData.status_bantuan) {
            case '1': // Ya
                totalScore += 1;
                break;
            case '2': // Tidak
                totalScore += 2;
                break;
            default:
                break;
        }

        // 32. Jenis Bantuan
        switch (formData.jenis_bantuan) {
            case '1': // Pemerintah
                totalScore += 1;
                break;
            case '2': // Masjid
                totalScore += 2;
                break;
            case '3': // Lembaga Sosial Lain
                totalScore += 3;
                break;
            case '4': // Tidak Ada
                totalScore += 4;
                break;
            default:
                break;
        }

        // 33. Frekuensi Bantuan
        switch (formData.frekuensi_bantuan) {
            case '1': // Bulanan
                totalScore += 1;
                break;
            case '2': // Triwulan
                totalScore += 2;
                break;
            case '3': // 6 Bulan
                totalScore += 3;
                break;
            case '4': // 1 Tahun
                totalScore += 4;
                break;
            case '5': // Tidak Pernah
                totalScore += 5;
                break;
            default:
                break;
        }

        return totalScore;
    };

    // Menghitung total_score setiap kali formData berubah menggunakan useMemo
    const totalScore = useMemo(() => calculateTotalScore(), [formData]);

    // Fungsi untuk menangani perubahan input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Pengecekan manual apakah semua field sudah terisi
        const emptyFields = Object.keys(formData).filter(key => {
            if (key === 'riwayat_hutang') return false; // Kecuali riwayat_hutang
            if (typeof formData[key] === 'number') return formData[key] === 0;
            return formData[key] === '';
        });

        if (emptyFields.length > 0) {
            alert(`Please fill out the following fields: ${emptyFields.join(', ')}`);
            return;
        }

        // Menambahkan total_score ke data yang akan dikirim
        const dataToSubmit = { ...formData, totalScore };

        try {
            // Insert data ke Supabase
            const { error } = await supabase
                .from('mustahik_data')
                .insert([dataToSubmit]);

            if (error) {
                console.error('Error submitting survey:', error);
                alert('Error submitting survey, please try again!');
            } else {
                alert('Survey submitted successfully!');
                // Reset form setelah submit
                setFormData({
                    tanggal_survey: '',
                    petugas_survey: 'Admin',
                    nama_mustahik: '',
                    bantuan_diajukan: '', 
                    jumlah_tanggungan: 0,
                    jumlah_anak_sekolah: 0,
                    jumlah_anak_putus_sekolah: 0,
                    pengeluaran_bulanan: 0,
                    obat_rutin: 0,
                    biaya_pendidikan: 0,
                    riwayat_hutang: false,
                    keperluan_hutang: '',
                    pekerjaan_kepala_keluarga: '',
                    pekerjaan_suami_istri: '',
                    usia_mustahik: 0,
                    kondisi_kepala_keluarga: '',
                    kepemilikan_rumah: '',
                    luas_rumah: '',
                    dinding_rumah: '',
                    lantai_rumah: '',
                    atap_rumah: '',
                    sumber_air: '',
                    mck: '',
                    penerangan: '',
                    listrik_terpasang: '',
                    kelayakan_tidur: '',
                    belanja_harian: 0,
                    aset_tidak_bergerak: '',
                    aset_bergerak: '',
                    status_bantuan: '',
                    jenis_bantuan: '',
                    frekuensi_bantuan: '',
                    bantuan_yang_diterima: '',
                    rencana_tindak_lanjut: '',
                });
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred, please try again!');
        }
    };
    

    return (
        <div className="app-container">
        <img src={bgImage} alt="Descriptive Alt Text" className="header-image" />
        {/* Judul Form */}
        <h1 className="form-title">Form Survey Mustahik</h1>
            <form onSubmit={handleSubmit}>
                <label>Tanggal Survey:</label>
                <input type="date" name="tanggal_survey" onChange={handleChange} required />
            <label>Petugas Survey:</label>
                <input
                    type="text"
                    name="petugas_survey"
                    value={formData.petugas_survey}
                    readOnly // This makes the field unchangeable
                    required
                />
            <label>Nama Mustahik:</label>
            <input type="text" name="nama_mustahik" onChange={handleChange} required />

            <label style={{ marginTop: '10px' }}>Bantuan yang diajukan oleh mustahik:</label>
            <input type="text" name="bantuan_diajukan" onChange={handleChange} required />

            <label>Jumlah Tanggungan:</label>
            <select name="jumlah_tanggungan" onChange={handleChange} required>
                <option value="">Pilih jumlah tanggungan</option>
                {[...Array(11).keys()].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>

            <label>Jumlah Anak yang Masih Sekolah:</label>
            <select name="jumlah_anak_sekolah" onChange={handleChange} required>
                <option value="">Pilih jumlah anak sekolah</option>
                {[...Array(11).keys()].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>

            <label>Jumlah Anak yang Putus Sekolah:</label>
            <select name="jumlah_anak_putus_sekolah" onChange={handleChange} required>
                <option value="">Pilih jumlah anak putus sekolah</option>
                {[...Array(9).keys()].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>

            <label>Pengeluaran Bulanan:</label>
            <select name="pengeluaran_bulanan" onChange={handleChange} required>
                <option value="">Pilih pengeluaran bulanan</option>
                <option value="0">0</option>
                <option value="1000000">250.000-1.000.000</option>
                <option value="2000000">500.000-1.000.000</option>
                <option value="3000000">1.000.000-2.000.000</option>
                <option value="2juta-3 juta">2.000.000-3.000.000</option>
                <option value="3000000">lebih dari 3.000.000</option>
            </select>

            <label>Obat Rutin (Rp):</label>
            <select name="obat_rutin" onChange={handleChange} required>
                <option value="">Pilih obat rutin</option>
                <option value="0">0</option>
                <option value="500000">Kurang dari 200.000</option>
                <option value="1000000">300.000-500.000</option>
                <option value="2000000">500.000-1.000.000</option>
                <option value="3000000">lebih dari 1.000.000</option>
            </select>

            <label>Biaya Pendidikan (Rp):</label>
            <select name="biaya_pendidikan" onChange={handleChange} required>
                <option value="">Pilih biaya pendidikan</option>
                <option value="0">0</option>
                <option value="500000">500.000</option>
                <option value="1000000">1.000.000</option>
                <option value="2000000">2.000.000</option>
                <option value="3000000">500.000-1.000.000</option>
                <option value="4000000">250.000-500.000</option>
                <option value="5000000">lebih dari 2.000.000</option>
            </select>

            <label>Riwayat Hutang:</label>
            <select name="riwayat_hutang" onChange={handleChange} required>
                <option value="">Pilih riwayat hutang</option>
                <option value="false">Tidak</option>
                <option value="true">Ya</option>
            </select>

            <label>Keperluan Hutang:</label>
            <select name="keperluan_hutang" onChange={handleChange} required>
                <option value="">Pilih keperluan hutang</option>
                <option value="kebutuhan hidup">Kebutuhan Hidup</option>
                <option value="biaya kesehatan">Biaya Kesehatan</option>
                <option value="biaya pendidikan">Biaya Pendidikan</option>
                <option value="kebutuhan sosial">Kebutuhan Sosial</option>
                <option value="kebutuhan sekunder">Kebutuhan Sekunder</option>
                <option value="Tidak Ada">Tidak Ada</option>
            </select>

            <label>Pekerjaan Kepala Keluarga:</label>
            <select name="pekerjaan_kepala_keluarga" onChange={handleChange} required>
                <option value="">Pilih pekerjaan</option>
                <option value="PNS">PNS</option>
                <option value="dagang">Dagang</option>
                <option value="karyawan">Karyawan</option>
                <option value="serabutan">Serabutan</option>
                <option value="menganggur">Menganggur</option>
            </select>

            <label>Pekerjaan Suami/Istri:</label>
            <select name="pekerjaan_suami_istri" onChange={handleChange} required>
                <option value="">Pilih pekerjaan</option>
                <option value="PNS">PNS</option>
                <option value="dagang">Dagang</option>
                <option value="karyawan">Karyawan</option>
                <option value="serabutan">Serabutan</option>
                <option value="menganggur">Menganggur</option>
            </select>

            <label>Usia Mustahik:</label>
            <select name="usia_mustahik" onChange={handleChange} required>
                <option value="">Pilih usia mustahik</option>
                {[...Array(81).keys()].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>

            <label>Kondisi Kepala Keluarga:</label>
            <select name="kondisi_kepala_keluarga" onChange={handleChange} required>
                <option value="">Pilih kondisi</option>
                <option value="sakit menahun">Sakit Menahun</option>
                <option value="sakit-sakitan">Sakit-sakitan</option>
                <option value="manula">Manula</option>
                <option value="sehat dan tidak kerja">Sehat dan Tidak Kerja</option>
                <option value="sehat dan kerja">Sehat dan Kerja</option>
            </select>

            <label>Kepemilikan Rumah:</label>
            <select name="kepemilikan_rumah" onChange={handleChange} required>
                <option value="">Pilih kepemilikan</option>
                <option value="sendiri">Menumpang</option>
                <option value="sewa">Kontrak</option>
                <option value="gratis">Keluarga</option>
                <option value="gratis">Sendiri</option>
            </select>

            <label>Luas Rumah:</label>
            <select name="luas_rumah" onChange={handleChange} required>
                <option value="">Pilih luas rumah</option>
                <option value="sangat kecil">Sangat Kecil</option>
                <option value="kecil">3X3 M</option>
                <option value="sedang">4x6 M</option>
                <option value="besar">LUAS</option>
            </select>

            <label>Dinding Rumah:</label>
            <select name="dinding_rumah" onChange={handleChange} required>
                <option value="">Pilih dinding rumah</option>
                <option value="bambu">Bambu</option>
                <option value="semen">Seng</option>
                <option value="bata">Kalsibot</option>
                <option value="bata">Semi Tembok</option>
                <option value="bata"></option>
            </select>

            <label>Lantai Rumah:</label>
            <select name="lantai_rumah" onChange={handleChange} required>
                <option value="">Pilih lantai rumah</option>
                <option value="tanah">Tanah</option>
                <option value="tanah">Panggung</option>
                <option value="keramik">Keramik</option>
                <option value="semen">Semen</option>
            </select>

            <label>Atap Rumah:</label>
            <select name="atap_rumah" onChange={handleChange} required>
                <option value="">Pilih atap rumah</option>
                <option value="rumbia">Rumbia</option>
                <option value="genteng">Genteng</option>
                <option value="asbes">Asbes</option>
                <option value="semen">Seng</option>
            </select>

            <label>Sumber Air:</label>
            <select name="sumber_air" onChange={handleChange} required>
                <option value="">Pilih sumber air</option>
                <option value="tidak ada">Tidak Ada</option>
                <option value="tidak ada">Bersama</option>
                <option value="air sumur">Air Sumur Bor</option>
                <option value="air sumur">Air Sumur Galian</option>
                <option value="air PDAM">Air PDAM</option>
            </select>

            <label>MCK:</label>
            <select name="mck" onChange={handleChange} required>
                <option value="">Pilih MCK</option>
                <option value="tidak ada">Tidak Ada</option>
                <option value="sendiri">Sendiri</option>
                <option value="tangki">Bersama</option>
            </select>

            <label>Penerangan:</label>
            <select name="penerangan" onChange={handleChange} required>
                <option value="">Pilih penerangan</option>
                <option value="genset">Genset</option>
                <option value="listrik">PLN</option>
                <option value="sALURAN">Saluran</option>
                <option value="lilin">Lilin</option>
            </select>

            <label>Listrik Terpasang:</label>
            <select name="listrik_terpasang" onChange={handleChange} required>
                <option value="">Pilih status listrik</option>
                <option value="tidak terpasang">1.300kwh</option>
                <option value="tidak terpasang">900kwh</option>
                <option value="tidak terpasang">450kwh</option>
                <option value="terpasang">Tidak ada</option>
            </select>

            <label>Kelayakan Tidur:</label>
            <select name="kelayakan_tidur" onChange={handleChange} required>
                <option value="">Pilih kelayakan tidur</option>
                <option value="spring bed">Spring Bed</option>
                <option value="matras">Kasur Busa</option>
                <option value="matras">Kasur Kapuk</option>
                <option value="lantai">Tikar/karpet</option>
            </select>
            <label>Belanja Harian:</label>
            <select name="belanja_harian" onChange={handleChange} required>
                <option value="">Pilih belanja harian</option>
                <option value="0">0</option>
                <option value="50000">lebih dari 100.000</option>
                <option value="100000">50.000-100.000</option>
                <option value="200000">50.000-100.000</option>
                <option value="300000">25.000-50.000</option>
                <option value="400000">15.000-25.000</option>
                <option value="500000">1.000-15.000</option>
            </select>

            <label>Aset Tidak Bergerak:</label>
            <select name="aset_tidak_bergerak" onChange={handleChange} required>
                <option value="">Pilih aset tidak bergerak</option>
                <option value="tidak punya">Tidak Punya</option>
                <option value="ada">500m2-750m2</option>
                <option value="ada">lebih dari atau sama dengan 500m2</option>
            </select>

            <label>Aset Bergerak:</label>
            <select name="aset_bergerak" onChange={handleChange} required>
                <option value="">Pilih aset bergerak</option>
                <option value="tidak punya">Tidak Punya</option>
                <option value="mobil">Mobil</option>
                <option value="Motor">Motor</option>
                <option value="Sepeda">Sepeda</option>
            </select>

            <label>Menerima Bantuan:</label>
        <select name="status_bantuan" onChange={handleChange} required>
            <option value="">Pilih status bantuan</option>
            <option value="1">Ya </option>
            <option value="2">Tidak </option>
        </select>

        <label>Jenis Bantuan:</label>
        <select name="jenis_bantuan" onChange={handleChange} required>
        <option value="">Pilih jenis bantuan</option>
            <option value="1">Pemerintah </option>
            <option value="2">Masjid </option>
            <option value="3">Lembaga Sosial Lain</option>
            <option value="4">Tidak Ada</option>
        </select>

        <label>Frekuensi Bantuan yang Diterima:</label>
            <select name="frekuensi_bantuan" onChange={handleChange} required>
                <option value="">Pilih frekuensi bantuan</option>
                <option value="1">Bulanan</option>
                <option value="2">Triwulan</option>
                <option value="3">6 Bulan</option>
                <option value="4">1 Tahun</option>
                <option value="5">Tidak Pernah</option>
            </select>

        <label>Nama Program bantuan yang sudah di terima:</label>
            <input type="text" name="bantuan_yang_diterima" onChange={handleChange} required />

        <label>Rencana Tindak Lanjut:</label>
            <input type="text" name="rencana_tindak_lanjut" onChange={handleChange} required />

         {/* Display the total score */}
            <p>Total Score: {formData.total_score}</p>
            <button type="submit">Submit</button>
            </form>
            </div>
    );
};

export default App;
