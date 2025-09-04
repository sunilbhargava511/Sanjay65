'use client';

import { useState } from 'react';

export default function DatabaseManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/export-db');
      
      if (!response.ok) {
        throw new Error('Failed to export database');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zerofinanx_backup_${new Date().toISOString().slice(0, 10)}.db`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setMessage('Database exported successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setError('Please select a database file to import');
      return;
    }

    setIsImporting(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('database', importFile);

      const response = await fetch('/api/admin/import-db', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import database');
      }

      setMessage('Database imported successfully. A backup of the previous database has been created.');
      setImportFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Database Management</h1>
          
          {message && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Export Database</h2>
              <p className="text-gray-600 mb-4">
                Download a complete backup of your database as a .db file
              </p>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Export Database'}
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Import Database</h2>
              <p className="text-gray-600 mb-4">
                Replace the current database with a backup file. The current database will be backed up automatically.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Database File
                  </label>
                  <input
                    type="file"
                    accept=".db"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                <button
                  onClick={handleImport}
                  disabled={isImporting || !importFile}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Importing...' : 'Import Database'}
                </button>
              </div>
            </div>

            <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>Always export a backup before importing a new database</li>
                <li>Importing will replace all current data</li>
                <li>Automatic backups are created when importing</li>
                <li>Database files are stored in the data/ directory</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}