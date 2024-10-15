import React, { useState, useMemo } from 'react';
import { supabase } from './supabaseClient'; // Ensure correct import
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
        jumlah_angsuran_bulanan: '',
        biaya_perbulan: '',
        biaya_listrik_perbulan: '',
        pengeluaran_lainnya: {
            wifi: '',
            kuota: '',
            bensin: '',
            lainnya: ''
        },
        riwayat_hutang: false, // Changed to boolean
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
        kelayakan_tidur: '',
        aset_tidak_bergerak: '',
        aset_bergerak: '',
        status_bantuan: '',
        jenis_bantuan: '',
        frekuensi_bantuan: '',
        bantuan_yang_diterima: '',
        rencana_tindak_lanjut: '',
    });

    // Function to calculate total score
    const calculateTotalScore = () => {
        let totalScore = 0;

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

        // 4. Biaya Perbulan (Combined Field)
        // Assuming "biaya_perbulan" holds point values directly
        totalScore += parseInt(formData.biaya_perbulan) || 0;

        // 5. Jumlah Angsuran Bulanan
        switch (formData.jumlah_angsuran_bulanan) {
            case '1':
                totalScore += 1;
                break;
            case '2':
                totalScore += 2;
                break;
            case '3':
                totalScore += 3;
                break;
            case '4':
                totalScore += 4;
                break;
            case '5':
                totalScore += 5;
                break;
            default:
                break;
        }

        // 6. Biaya Listrik Perbulan
        switch (formData.biaya_listrik_perbulan) {
            case '5':
                totalScore += 5;
                break;
            case '4':
                totalScore += 4;
                break;
            case '3':
                totalScore += 3;
                break;
            case '2':
                totalScore += 2;
                break;
            case '1':
                totalScore += 1;
                break;
            default:
                break;
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

        // 10. Pekerjaan Suami/Istri
        switch (formData.pekerjaan_suami_istri) {
            case 'PNS': totalScore += 1; break;
            case 'dagang': totalScore += 2; break;
            case 'karyawan': totalScore += 3; break;
            case 'serabutan': totalScore += 4; break;
            case 'menganggur': totalScore += 5; break;
            default: break;
        }

        // 11. Usia Mustahik
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

        // 12. Kondisi Kepala Keluarga
        switch (formData.kondisi_kepala_keluarga) {
            case 'sakit menahun': totalScore += 5; break;
            case 'sakit-sakitan': totalScore += 4; break;
            case 'manula': totalScore += 3; break;
            case 'sehat dan tidak kerja': totalScore += 2; break;
            case 'sehat dan kerja': totalScore += 1; break;
            default: break;
        }

        // 13. Kepemilikan Rumah
        switch (formData.kepemilikan_rumah) {
            case 'menumpang': totalScore += 5; break;
            case 'kontrak': totalScore += 4; break;
            case 'keluarga': totalScore += 3; break;
            case 'sendiri': totalScore += 1; break;
            default: break;
        }

        // 14. Luas Rumah
        if (formData.luas_rumah === 'Sangat kecil') {
            totalScore += 5;
        } else if (formData.luas_rumah === '3×3 m') {
            totalScore += 4;
        } else if (formData.luas_rumah === '4×6 m') {
            totalScore += 3;
        } else {
            totalScore += 1;
        }

        // 15. Dinding Rumah
        switch (formData.dinding_rumah) {
            case 'bambu': totalScore += 5; break;
            case 'seng': totalScore += 4; break;
            case 'kalsibot': totalScore += 3; break;
            case 'semi tembok': totalScore += 2; break;
            case 'batu bata': totalScore += 1; break;
            default: break;
        }

        // 16. Lantai Rumah
        switch (formData.lantai_rumah) {
            case 'tanah': totalScore += 5; break;
            case 'panggung': totalScore += 4; break;
            case 'semen': totalScore += 3; break;
            case 'keramik': totalScore += 1; break;
            default: break;
        }

        // 17. Atap Rumah
        switch (formData.atap_rumah) {
            case 'rumbia': totalScore += 5; break;
            case 'seng': totalScore += 4; break;
            case 'asbes': totalScore += 3; break;
            case 'genteng': totalScore += 1; break;
            default: break;
        }

        // 18. Sumber Air
        switch (formData.sumber_air) {
            case 'tidak ada': totalScore += 5; break;
            case 'bersama': totalScore += 4; break;
            case 'sumur bor': totalScore += 1; break;
            case 'sumur gali': totalScore += 3; break;
            case 'PDAM': totalScore += 2; break;
            default: break;
        }

        // 19. MCK
        switch (formData.mck) {
            case 'tidak ada': totalScore += 5; break;
            case 'bersama': totalScore += 4; break;
            case 'sendiri': totalScore += 1; break;
            default: break;
        }

        // 20. Penerangan
        switch (formData.penerangan.toLowerCase()) { // Ensuring case-insensitivity
            case 'genset': totalScore += 1; break;
            case 'pln': totalScore += 2; break;
            case 'saluran': totalScore += 3; break;
            case 'sentir/lilin':
            case 'lilin':
            case 'sentir': // Added variations
                totalScore += 5; break;
            default: break;
        }

        // 21. Biaya Listrik Perbulan
        switch (formData.biaya_listrik_perbulan) {
            case '5': // Kurang dari 50 ribu
                totalScore += 5;
                break;
            case '4': // 50 ribu - 100 ribu
                totalScore += 4;
                break;
            case '3': // 100 ribu - 200 ribu
                totalScore += 3;
                break;
            case '2': // 200 ribu - 300 ribu
                totalScore += 2;
                break;
            case '1': // > 300 ribu
                totalScore += 1;
                break;
            default:
                break;
        }

        // 22. Kelayakan Tidur
        switch (formData.kelayakan_tidur) {
            case 'spring bed': totalScore += 1; break;
            case 'kasur busa': totalScore += 2; break;
            case 'kasur kapuk': totalScore += 3; break;
            case 'tikar/karpet': totalScore += 5; break;
            default: break;
        }

        // 29. Aset Tidak Bergerak
        if (formData.aset_tidak_bergerak === 'tidak punya') {
            totalScore += 5;
        } else if (formData.aset_tidak_bergerak === 'kurang dari 500m²') {
            totalScore += 4;
        } else {
            totalScore += 2;
        }

        // 26. Aset Bergerak
        switch (formData.aset_bergerak.toLowerCase()) { // Ensuring case-insensitivity
            case 'mobil': totalScore += 1; break;
            case 'motor': totalScore += 2; break;
            case 'sepeda': totalScore += 4; break;
            case 'tidak punya': totalScore += 5; break;
            default: break;
        }

        // 27. Status Bantuan
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

        // 28. Jenis Bantuan
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

        // 29. Frekuensi Bantuan
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

    // Calculate total_score whenever formData changes using useMemo
    const totalScore = useMemo(() => calculateTotalScore(), [formData]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('pengeluaran_lainnya')) {
            const field = name.split('.')[1];
            setFormData(prevData => ({
                ...prevData,
                pengeluaran_lainnya: {
                    ...prevData.pengeluaran_lainnya,
                    [field]: type === 'number' ? Number(value) : value
                }
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Manual check for empty fields
        const emptyFields = Object.keys(formData).filter(key => {
            if (key === 'pengeluaran_lainnya') {
                const subFields = Object.keys(formData[key]);
                return subFields.some(subKey => formData[key][subKey] === '' || subKey !== 'lainnya' && formData[key][subKey] === 0);
            }
            if (key === 'riwayat_hutang') return false; // Optional
            if (typeof formData[key] === 'number') {
                // Tentukan bidang mana yang harus tidak 0, atau abaikan jika 0 diperbolehkan
                // Misalnya, jika 'jumlah_tanggungan' bisa 0:
                if (['jumlah_tanggungan', 'jumlah_anak_sekolah', 'jumlah_anak_putus_sekolah', 'usia_mustahik'].includes(key)) {
                    return false; // Tidak dianggap kosong meskipun 0
                }
                return formData[key] === 0;
            }
            return formData[key] === '';
        });
    
        if (emptyFields.length > 0) {
            alert(`Please fill out the following fields: ${emptyFields.join(', ')}`);
            return;
        }
    
        // Prepare data to submit, including totalScore
        const dataToSubmit = { ...formData, totalScore };
    
        try {
            // Insert data into Supabase
            const { error } = await supabase
                .from('mustahik_data')
                .insert([dataToSubmit]);
    
            if (error) {
                console.error('Error submitting survey:', error);
                alert('Error submitting survey, please try again!');
            } else {
                alert('Survey submitted successfully!');
                // Reset form after submission
                setFormData({
                    tanggal_survey: '',
                    petugas_survey: 'Admin',
                    nama_mustahik: '',
                    bantuan_diajukan: '', 
                    jumlah_tanggungan: 0,
                    jumlah_anak_sekolah: 0,
                    jumlah_anak_putus_sekolah: 0,
                    jumlah_angsuran_bulanan: '',
                    biaya_perbulan: '',
                    biaya_listrik_perbulan: '',
                    pengeluaran_lainnya: {
                        wifi: '',
                        kuota: '',
                        bensin: '',
                        lainnya: ''
                    },
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
                    kelayakan_tidur: '',
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
            {/* Form Title */}
            <h1 className="form-title">Form Survey Mustahik</h1>
            <form onSubmit={handleSubmit}>
                {/* Tanggal Survey */}
                <label>Tanggal Survey:</label>
                <input
                    type="date"
                    name="tanggal_survey"
                    value={formData.tanggal_survey}
                    onChange={handleChange}
                    required
                />

                {/* Petugas Survey */}
                <label>Petugas Survey:</label>
                <input
                    type="text"
                    name="petugas_survey"
                    value={formData.petugas_survey}
                    readOnly
                    required
                />

                {/* Nama Mustahik */}
                <label>Nama Mustahik:</label>
                <input
                    type="text"
                    name="nama_mustahik"
                    value={formData.nama_mustahik}
                    onChange={handleChange}
                    required
                />

                {/* Bantuan yang diajukan */}
                <label style={{ marginTop: '10px' }}>Bantuan yang diajukan oleh mustahik:</label>
                <input
                    type="text"
                    name="bantuan_diajukan"
                    value={formData.bantuan_diajukan}
                    onChange={handleChange}
                    required
                />

                {/* Jumlah Tanggungan */}
                <label>Jumlah Tanggungan:</label>
                <select
                    name="jumlah_tanggungan"
                    value={formData.jumlah_tanggungan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih jumlah tanggungan</option>
                    {[...Array(11).keys()].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>

                {/* Jumlah Anak yang Masih Sekolah */}
                <label>Jumlah Anak yang Masih Sekolah:</label>
                <select
                    name="jumlah_anak_sekolah"
                    value={formData.jumlah_anak_sekolah}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih jumlah anak sekolah</option>
                    {[...Array(11).keys()].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>

                {/* Jumlah Anak yang Putus Sekolah */}
                <label>Jumlah Anak yang Putus Sekolah:</label>
                <select
                    name="jumlah_anak_putus_sekolah"
                    value={formData.jumlah_anak_putus_sekolah}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih jumlah anak putus sekolah</option>
                    {[...Array(9).keys()].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>

                {/* Keperluan Hutang */}
                <label>Keperluan Hutang:</label>
                <select
                    name="keperluan_hutang"
                    value={formData.keperluan_hutang}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih keperluan hutang</option>
                    <option value="kebutuhan hidup">Kebutuhan Hidup</option>
                    <option value="biaya kesehatan">Biaya Kesehatan</option>
                    <option value="biaya pendidikan">Biaya Pendidikan</option>
                    <option value="kebutuhan sosial">Kebutuhan Sosial</option>
                    <option value="kebutuhan sekunder">Kebutuhan Sekunder</option>
                    <option value="tidak ada">Tidak Ada</option>
                </select>

                {/* Jumlah Angsuran Bulanan */}
                <label>Jumlah Angsuran Bulanan:</label>
                <select
                    name="jumlah_angsuran_bulanan"
                    value={formData.jumlah_angsuran_bulanan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih jumlah angsuran bulanan</option>
                    <option value="1">500 ribu - 1 juta (1 poin)</option>
                    <option value="2">1 juta - 2 juta (2 poin)</option>
                    <option value="3">2 juta - 3 juta (3 poin)</option>
                    <option value="4">3 juta - 4 juta (4 poin)</option>
                    <option value="5">4 juta - 5 juta (5 poin)</option>
                    <option value="5"> 5 juta (5 poin)</option>
                </select>

                {/* Biaya Perbulan */}
                <label>Biaya Perbulan:</label>
                <select
                    name="biaya_perbulan"
                    value={formData.biaya_perbulan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih biaya perbulan</option>
                    <option value="0">0</option>
                    <option value="5">Kurang dari 50 ribu (5 poin)</option>
                    <option value="4">50 ribu - 100 ribu (4 poin)</option>
                    <option value="3">100 ribu - 200 ribu (3 poin)</option>
                    <option value="2">200 ribu - 300 ribu (2 poin)</option>
                    <option value="1"> 300 ribu (1 poin)</option>
                </select>

                {/* Biaya Listrik Perbulan */}
                <label>Biaya Listrik Perbulan:</label>
                <select
                    name="biaya_listrik_perbulan"
                    value={formData.biaya_listrik_perbulan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih biaya listrik perbulan</option>
                    <option value="5">Kurang dari 50 ribu (5 poin)</option>
                    <option value="4">50 ribu - 100 ribu (4 poin)</option>
                    <option value="3">100 ribu - 200 ribu (3 poin)</option>
                    <option value="2">200 ribu - 300 ribu (2 poin)</option>
                    <option value="1"> 300 ribu (1 poin)</option>
                </select>

                {/* Pengeluaran Lainnya */}
                <label>Pengeluaran Lainnya:</label>
                <div className="pengeluaran-lainnya">
                    <label>WiFi perbulan:</label>
                    <input
                        type="number"
                        name="pengeluaran_lainnya.wifi"
                        value={formData.pengeluaran_lainnya.wifi}
                        onChange={handleChange}
                        min="0"
                        placeholder="Jumlah biaya WiFi"
                        required
                    />

                    <label>Kuota perbulan:</label>
                    <input
                        type="number"
                        name="pengeluaran_lainnya.kuota"
                        value={formData.pengeluaran_lainnya.kuota}
                        onChange={handleChange}
                        min="0"
                        placeholder="Jumlah biaya Kuota"
                        required
                    />

                    <label>Bensin perbulan:</label>
                    <input
                        type="number"
                        name="pengeluaran_lainnya.bensin"
                        value={formData.pengeluaran_lainnya.bensin}
                        onChange={handleChange}
                        min="0"
                        placeholder="Jumlah biaya Bensin"
                        required
                    />

                    <label>Pengeluaran Lainnya:</label>
                    <input
                        type="text"
                        name="pengeluaran_lainnya.lainnya"
                        value={formData.pengeluaran_lainnya.lainnya}
                        onChange={handleChange}
                        placeholder="Pengeluaran lainnya"
                        required
                    />
                </div>

                {/* Pekerjaan Kepala Keluarga */}
                <label>Pekerjaan Kepala Keluarga:</label>
                <select
                    name="pekerjaan_kepala_keluarga"
                    value={formData.pekerjaan_kepala_keluarga}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih pekerjaan</option>
                    <option value="PNS">PNS</option>
                    <option value="dagang">Dagang</option>
                    <option value="karyawan">Karyawan</option>
                    <option value="serabutan">Serabutan</option>
                    <option value="menganggur">Menganggur</option>
                </select>

                {/* Pekerjaan Suami/Istri */}
                <label>Pekerjaan Suami/Istri:</label>
                <select
                    name="pekerjaan_suami_istri"
                    value={formData.pekerjaan_suami_istri}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih pekerjaan</option>
                    <option value="PNS">PNS</option>
                    <option value="dagang">Dagang</option>
                    <option value="karyawan">Karyawan</option>
                    <option value="serabutan">Serabutan</option>
                    <option value="menganggur">Menganggur</option>
                </select>

                {/* Usia Mustahik */}
                <label>Usia Mustahik:</label>
                <select
                    name="usia_mustahik"
                    value={formData.usia_mustahik}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih usia mustahik</option>
                    {[...Array(81).keys()].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>

                {/* Kondisi Kepala Keluarga */}
                <label>Kondisi Kepala Keluarga:</label>
                <select
                    name="kondisi_kepala_keluarga"
                    value={formData.kondisi_kepala_keluarga}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih kondisi</option>
                    <option value="sakit menahun">Sakit Menahun</option>
                    <option value="sakit-sakitan">Sakit-sakitan</option>
                    <option value="manula">Manula</option>
                    <option value="sehat dan tidak kerja">Sehat dan Tidak Kerja</option>
                    <option value="sehat dan kerja">Sehat dan Kerja</option>
                </select>

                {/* Kepemilikan Rumah */}
                <label>Kepemilikan Rumah:</label>
                <select
                    name="kepemilikan_rumah"
                    value={formData.kepemilikan_rumah}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih kepemilikan</option>
                    <option value="menumpang">Menumpang</option>
                    <option value="kontrak">Kontrak</option>
                    <option value="keluarga">Keluarga</option>
                    <option value="sendiri">Sendiri</option>
                </select>

                {/* Luas Rumah */}
                <label>Luas Rumah:</label>
                <select
                    name="luas_rumah"
                    value={formData.luas_rumah}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih luas rumah</option>
                    <option value="Sangat kecil">Sangat Kecil</option>
                    <option value="3×3 m">3×3 m</option>
                    <option value="4×6 m">4×6 m</option>
                    <option value="LUAS">LUAS</option>
                </select>

                {/* Dinding Rumah */}
                <label>Dinding Rumah:</label>
                <select
                    name="dinding_rumah"
                    value={formData.dinding_rumah}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih dinding rumah</option>
                    <option value="bambu">Bambu</option>
                    <option value="seng">Seng</option>
                    <option value="kalsibot">Kalsibot</option>
                    <option value="semi tembok">Semi Tembok</option>
                    <option value="batu bata">Batu Bata</option>
                </select>

                {/* Lantai Rumah */}
                <label>Lantai Rumah:</label>
                <select
                    name="lantai_rumah"
                    value={formData.lantai_rumah}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih lantai rumah</option>
                    <option value="tanah">Tanah</option>
                    <option value="panggung">Panggung</option>
                    <option value="semen">Semen</option>
                    <option value="keramik">Keramik</option>
                </select>

                {/* Atap Rumah */}
                <label>Atap Rumah:</label>
                <select
                    name="atap_rumah"
                    value={formData.atap_rumah}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih atap rumah</option>
                    <option value="rumbia">Rumbia</option>
                    <option value="seng">Seng</option>
                    <option value="asbes">Asbes</option>
                    <option value="genteng">Genteng</option>
                </select>

                {/* Sumber Air */}
                <label>Sumber Air:</label>
                <select
                    name="sumber_air"
                    value={formData.sumber_air}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih sumber air</option>
                    <option value="tidak ada">Tidak Ada</option>
                    <option value="bersama">Bersama</option>
                    <option value="sumur bor">Air Sumur Bor</option>
                    <option value="sumur gali">Air Sumur Galian</option>
                    <option value="PDAM">Air PDAM</option>
                </select>

                {/* MCK */}
                <label>MCK:</label>
                <select
                    name="mck"
                    value={formData.mck}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih MCK</option>
                    <option value="tidak ada">Tidak Ada</option>
                    <option value="bersama">Bersama</option>
                    <option value="sendiri">Sendiri</option>
                </select>

                {/* Penerangan */}
                <label>Penerangan:</label>
                <select
                    name="penerangan"
                    value={formData.penerangan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih penerangan</option>
                    <option value="genset">Genset</option>
                    <option value="pln">PLN</option>
                    <option value="saluran">Saluran</option>
                    <option value="sentir/lilin">Sentir/Lilin</option>
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

            <label>Jumlah Makan per Hari:</label>
            <select name="jumlah_makan_perhari" onChange={handleChange} required>
                <option value="">Pilih jumlah makan</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>

            <label>Ayam Konsumsi:</label>
            <select name="ayam_konsumsi" onChange={handleChange} required>
                <option value="">Pilih frekuensi ayam konsumsi</option>
                <option value="tidak pernah">Tidak Pernah</option>
                <option value="sebulan sekali">Sebulan Sekali</option>
                <option value="seminggu sekali">Seminggu Sekali</option>
                <option value="setiap hari">Setiap Hari</option>
            </select>

            <label>Daging Konsumsi:</label>
            <select name="daging_konsumsi" onChange={handleChange} required>
                <option value="">Pilih frekuensi daging konsumsi</option>
                <option value="tidak pernah">Tidak Pernah</option>
                <option value="sebulan sekali">Sebulan Sekali</option>
                <option value="seminggu sekali">Seminggu Sekali</option>
                <option value="setiap hari">Setiap Hari</option>
            </select>

            <label>Susu Konsumsi:</label>
            <select name="susu_konsumsi" onChange={handleChange} required>
                <option value="">Pilih frekuensi susu konsumsi</option>
                <option value="tidak pernah">Tidak Pernah</option>
                <option value="sebulan sekali">Sebulan Sekali</option>
                <option value="seminggu sekali">Seminggu Sekali</option>
                <option value="setiap hari">Setiap Hari</option>
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

                {/* Aset Bergerak */}
                <label>Aset Bergerak:</label>
                <select
                    name="aset_bergerak"
                    value={formData.aset_bergerak}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih aset bergerak</option>
                    <option value="tidak punya">Tidak Punya</option>
                    <option value="mobil">Mobil</option>
                    <option value="motor">Motor</option>
                    <option value="sepeda">Sepeda</option>
                </select>

                {/* Status Bantuan */}
                <label>Penerimaan Bantuan:</label>
                <select
                    name="status_bantuan"
                    value={formData.status_bantuan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih status bantuan</option>
                    <option value="1">Ya</option>
                    <option value="2">Tidak</option>
                </select>

                {/* Jenis Bantuan */}
                <label>Jenis Bantuan:</label>
                <select
                    name="jenis_bantuan"
                    value={formData.jenis_bantuan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih jenis bantuan</option>
                    <option value="1">Pemerintah</option>
                    <option value="2">Masjid</option>
                    <option value="3">Lembaga Sosial Lain</option>
                    <option value="4">Tidak Ada</option>
                </select>

                {/* Frekuensi Bantuan */}
                <label>Frekuensi Bantuan yang Diterima:</label>
                <select
                    name="frekuensi_bantuan"
                    value={formData.frekuensi_bantuan}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih frekuensi bantuan</option>
                    <option value="1">Bulanan</option>
                    <option value="2">Triwulan</option>
                    <option value="3">6 Bulan</option>
                    <option value="4">1 Tahun</option>
                    <option value="5">Tidak Pernah</option>
                </select>

                {/* Nama Program Bantuan yang Sudah Diterima */}
                <label>Nama Program Bantuan yang Sudah Diterima:</label>
                <input
                    type="text"
                    name="bantuan_yang_diterima"
                    value={formData.bantuan_yang_diterima}
                    onChange={handleChange}
                    required
                />

                {/* Rencana Tindak Lanjut */}
                <label>Rencana Tindak Lanjut:</label>
                <input
                    type="text"
                    name="rencana_tindak_lanjut"
                    value={formData.rencana_tindak_lanjut}
                    onChange={handleChange}
                    required
                />

                {/* Display the total score */}
                <p>Total Score: {totalScore}</p>
                <button type="submit">Submit</button>
            </form>
        </div>
    );

};

export default App;
