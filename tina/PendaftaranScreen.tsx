import React, { useState, useEffect } from 'react';

// Interfaces based on DB schema
interface Pendaftar {
    id: number;
    kode_pendaftaran: string;
    tahun_pendaftaran: string; // or tahun_ppdb in legacy data
    tahun_ppdb?: string;
    nama_lengkap: string;
    status: 'pending' | 'review' | 'approved' | 'rejected' | null;
    created_at: string;
    updated_at: string;
}

export const PendaftaranScreen = () => {
    const [data, setData] = useState<Pendaftar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [yearFilter, setYearFilter] = useState('Semua');

    // Stats
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

    // Generate Year Options
    const currentYear = new Date().getFullYear();
    const futureYears = Array.from({ length: 11 }, (_, i) => {
        const start = currentYear + i;
        return `${start}/${start + 1}`;
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pendaftaran/list');
            const result = await res.json();

            if (result.success && result.data) {
                setData(result.data);
            } else {
                setError(result.message || 'Gagal mengambil data');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Recalculate stats whenever data changes
        const total = data.length;
        const pending = data.filter(d => !d.status || d.status === 'pending' || d.status === 'review').length;
        const approved = data.filter(d => d.status === 'approved').length;
        const rejected = data.filter(d => d.status === 'rejected').length;
        setStats({ total, pending, approved, rejected });
    }, [data]);

    const handleStatusChange = async (id: number, newStatus: string) => {
        if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/pendaftaran/update-status?id=${id}&status=${newStatus}`);
            const result = await res.json();

            if (result.success) {
                // Optimistically update UI
                setData(prevData => prevData.map(item =>
                    item.id === id ? { ...item, status: newStatus as any } : item
                ));
            } else {
                alert(result.message || 'Gagal mengubah status');
            }
        } catch (err) {
            alert('Terjadi kesalahan sistem');
        }
    };

    const handleDelete = async (id: number, nama: string) => {
        if (!confirm(`⚠️ HAPUS PERMANEN\n\nAnda yakin ingin menghapus data pendaftaran atas nama:\n"${nama}"?\n\nData tidak dapat dipulihkan setelah dihapus.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/pendaftaran/delete?id=${id}`);
            if (res.redirected || res.ok) {
                // Hapus dari state lokal
                setData(prevData => prevData.filter(item => item.id !== id));
            } else {
                const result = await res.json();
                alert(result.message || 'Gagal menghapus data');
            }
        } catch (err) {
            alert('Terjadi kesalahan sistem');
        }
    };

    const exportCSV = () => {
        if (filteredData.length === 0) {
            alert("Tidak ada data untuk diexport");
            return;
        }

        const BOM = "\uFEFF";
        const headers = ["ID Pendaftaran", "Nama Lengkap", "Tahun Akademik", "Status", "Tanggal Daftar"];

        const rows = filteredData.map(item => [
            `"${item.kode_pendaftaran}"`,
            `"${item.nama_lengkap.replace(/"/g, '""')}"`,
            `"${item.tahun_pendaftaran || item.tahun_ppdb || ""}"`,
            `"${item.status || 'pending'}"`,
            `"${new Date(item.created_at || Date.now()).toLocaleDateString('id-ID')}"`
        ]);

        const csvContent = BOM + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        const dateStr = new Date().toISOString().split('T')[0];
        const safeYear = yearFilter !== 'Semua' ? yearFilter.replace('/', '-') : 'Semua-Tahun';
        const fileName = `Pendaftaran_${safeYear}_${statusFilter}_${dateStr}.csv`;

        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const dbYears = Array.from(new Set(data.map(d => d.tahun_pendaftaran || d.tahun_ppdb).filter(Boolean)));
    const uniqueYears = Array.from(new Set([...dbYears, ...futureYears])).sort();

    const filteredData = data.filter(item => {
        const searchMatch = !search ||
            item.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
            item.kode_pendaftaran.toLowerCase().includes(search.toLowerCase());

        const itemStatus = item.status || 'pending';
        const statusMatch = statusFilter === 'Semua' ||
            (statusFilter === 'pending' && (itemStatus === 'pending' || itemStatus === 'review')) ||
            itemStatus === statusFilter;

        const itemYear = item.tahun_pendaftaran || item.tahun_ppdb;
        const yearMatch = yearFilter === 'Semua' || itemYear === yearFilter;

        return searchMatch && statusMatch && yearMatch;
    });

    const styles = `
        .admin-container { padding: 32px; font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f8fafc; min-height: 100vh; max-height: 100vh; overflow-y: auto; color: #0f172a; box-sizing: border-box; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .admin-title { font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; margin: 0; }
        
        .btn-group { display: flex; gap: 12px; }
        .btn-primary { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.2s; font-size: 14px; }
        .btn-primary:hover { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: translateY(-1px); }
        .btn-secondary { background: white; color: #475569; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s; font-size: 14px; }
        .btn-secondary:hover { border-color: #cbd5e1; color: #0f172a; box-shadow: 0 4px 6px rgba(0,0,0,0.04); }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
        .stat-card.total::before { background: #3b82f6; }
        .stat-card.waiting::before { background: #f59e0b; }
        .stat-card.approved::before { background: #10b981; }
        .stat-card.rejected::before { background: #ef4444; }
        .stat-title { font-size: 13px; font-weight: 600; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value { font-size: 36px; font-weight: 800; color: #0f172a; margin: 8px 0 0 0; line-height: 1; }
        
        .filters-bar { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 32px; }
        .filter-group { flex: 1; min-width: 200px; }
        .filter-label { display: block; font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
        .filter-input, .filter-select { width: 100%; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #0f172a; font-family: inherit; transition: all 0.2s; box-sizing: border-box; }
        .filter-input:focus, .filter-select:focus { outline: none; border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        
        .table-container { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .data-table th { background: #f8fafc; padding: 16px 24px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
        .data-table td { padding: 16px 24px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .data-table tbody tr { transition: background-color 0.2s; }
        .data-table tbody tr:hover { background-color: #f8fafc; }
        .id-cell { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #64748b; font-size: 13px; padding: 6px 10px; background: #f1f5f9; border-radius: 6px; display: inline-block; }
        .name-cell { font-weight: 600; color: #0f172a; }
        
        .status-select { padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid transparent; cursor: pointer; appearance: none; text-align: center; text-align-last: center; font-family: inherit; outline: none; transition: all 0.2s; line-height: 1; }
        .status-select.approved { background-color: #dcfce7; color: #166534; border-color: #bbf7d0; box-shadow: 0 2px 4px rgba(22, 101, 52, 0.05); }
        .status-select.rejected { background-color: #fee2e2; color: #991b1b; border-color: #fecaca; box-shadow: 0 2px 4px rgba(153, 27, 27, 0.05); }
        .status-select.pending { background-color: #fef9c3; color: #854d0e; border-color: #fef08a; box-shadow: 0 2px 4px rgba(133, 77, 14, 0.05); }
        .status-select.review { background-color: #dbeafe; color: #1e40af; border-color: #bfdbfe; box-shadow: 0 2px 4px rgba(30, 64, 175, 0.05); }
        .status-select:hover { filter: brightness(0.95); transform: translateY(-1px); }
        
        .btn-delete { background: transparent; border: 1px solid #fca5a5; color: #dc2626; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; font-family: inherit; }
        .btn-delete:hover { background: #dc2626; color: white; border-color: #dc2626; }
        
        .empty-state { padding: 64px 32px; text-align: center; color: #64748b; }
        .empty-state svg { width: 48px; height: 48px; margin: 0 auto 16px auto; color: #cbd5e1; }
        .empty-state h3 { margin: 0 0 8px 0; font-size: 18px; color: #0f172a; }
        .empty-state p { margin: 0; font-size: 14px; }
    `;

    if (loading) {
        return (
            <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#64748b' }}>
                <svg style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', height: '32px', width: '32px', color: '#3b82f6' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat data pendaftaran...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#991b1b', padding: '24px', borderRadius: '16px', border: '1px solid #fecaca' }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Terjadi Kesalahan</h2>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#b91c1c' }}>{error}</p>
                    <button onClick={fetchData} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Coba Lagi</button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <style>{styles}</style>

            <div className="admin-header">
                <h1 className="admin-title">Kelola Data Pendaftaran</h1>
                <div className="btn-group">
                    <button onClick={exportCSV} className="btn-primary">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Export CSV
                    </button>
                    <button onClick={fetchData} className="btn-secondary">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <p className="stat-title">Total Pendaftar</p>
                    <h2 className="stat-value">{stats.total}</h2>
                </div>
                <div className="stat-card waiting">
                    <p className="stat-title">Menunggu Review</p>
                    <h2 className="stat-value">{stats.pending}</h2>
                </div>
                <div className="stat-card approved">
                    <p className="stat-title">Diterima</p>
                    <h2 className="stat-value">{stats.approved}</h2>
                </div>
                <div className="stat-card rejected">
                    <p className="stat-title">Ditolak</p>
                    <h2 className="stat-value">{stats.rejected}</h2>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="filters-bar">
                <div className="filter-group">
                    <label className="filter-label">Cari Nama / ID Pendaftaran</label>
                    <input
                        type="text"
                        placeholder="Ketik nama atau SPMB-..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="filter-input"
                    />
                </div>
                <div className="filter-group" style={{ flex: '0 1 250px' }}>
                    <label className="filter-label">Tahun Akademik</label>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="Semua">Semua Tahun</option>
                        {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="filter-group" style={{ flex: '0 1 250px' }}>
                    <label className="filter-label">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="Semua">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="approved">Diterima</option>
                        <option value="rejected">Ditolak</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID Pendaftaran</th>
                            <th>Nama Lengkap</th>
                            <th>Tahun Akademik</th>
                            <th>Tanggal Daftar</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <span className="id-cell">{item.kode_pendaftaran}</span>
                                    </td>
                                    <td className="name-cell">{item.nama_lengkap}</td>
                                    <td>{item.tahun_pendaftaran || item.tahun_ppdb || '-'}</td>
                                    <td>
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        }) : '-'}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <select
                                            value={item.status || 'pending'}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                            className={`status-select ${(item.status || 'pending')}`}
                                        >
                                            <option value="pending">⏳ Menunggu</option>
                                            <option value="review">🔍 Review</option>
                                            <option value="approved">✅ Diterima</option>
                                            <option value="rejected">❌ Ditolak</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDelete(item.id, item.nama_lengkap)}
                                            className="btn-delete"
                                        >
                                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    <div className="empty-state">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <h3>Tidak ada data ditemukan</h3>
                                        <p>Coba sesuaikan filter pencarian, tahun, atau status Anda.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PendaftaranScreen;
