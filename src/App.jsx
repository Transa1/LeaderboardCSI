import React, { useState, useEffect } from 'react';
import { Trophy, User, LogOut, Lock, Crown } from 'lucide-react';
import { supabase } from './supabaseClient';

const CORRECT_PASSWORD = 'CebicheBienDeli123';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadLeaderboard();
    }
  }, [isAuthenticated]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Registros')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!userName.trim()) {
      setSubmitError('Por favor ingresa tu nombre');
      return;
    }

    // Verificar si el nombre ya existe
    const existingUser = leaderboard.find(
      entry => entry.name.toLowerCase() === userName.trim().toLowerCase()
    );

    if (existingUser) {
      setSubmitError('Este nombre ya está registrado en el leaderboard');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Registros')
        .insert([
          { name: userName.trim() }
        ])
        .select();

      if (error) throw error;

      // Agregar el nuevo registro al leaderboard
      setLeaderboard([...leaderboard, data[0]]);
      setUserName('');
      setHasRegistered(true);
      
      setTimeout(() => setHasRegistered(false), 3000);
    } catch (error) {
      setSubmitError('Error al guardar. Por favor intenta de nuevo.');
      console.error('Storage error:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setUserName('');
    setLeaderboard([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-purple-500 border-opacity-30">
          <div className="flex flex-col items-center mb-10">
            <div className="w-40 h-40 rounded-3xl flex items-center justify-center mb-6">
              <img src="logocsi.jpg" alt="Logo" className="w-full h-full object-contain p-4" />
            </div>
            <h1 className="text-4xl font-bold text-purple-100 mb-3">Bienvenido</h1>
            <p className="text-purple-300 text-center text-lg">Ingresa la contraseña para continuar</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 bg-opacity-50 border-2 border-purple-500 border-opacity-30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all outline-none text-purple-100 placeholder-purple-400 placeholder-opacity-50"
                  placeholder="Ingresa la contraseña"
                />
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-900 bg-opacity-30 p-3 rounded-lg">
                  <span className="text-red-400">⚠</span> {error}
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              style={{ backgroundColor: '#7145d6' }}
              className="w-full py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-500 border-opacity-30">
          <div style={{ background: 'linear-gradient(135deg, #7145d6 0%, #5a35ad 100%)' }} className="p-8 text-white shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-purple-800 bg-opacity-40 rounded-2xl flex items-center justify-center backdrop-blur-sm p-2">
                  <img src="logocsi.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-1">Leaderboard</h1>
                  <p className="text-purple-200 text-base">Demuestra tus conocimientos</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 bg-purple-900 bg-opacity-40 rounded-xl hover:bg-opacity-60 transition-all border border-purple-400 border-opacity-30"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Salir</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-900 to-gray-900 rounded-2xl p-8 border-2 border-purple-500 border-opacity-30 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div style={{ backgroundColor: '#7145d6' }} className="p-3 rounded-xl shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-purple-100">Registrarse</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-3">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                      className="w-full px-5 py-4 bg-gray-900 bg-opacity-60 border-2 border-purple-500 border-opacity-30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all outline-none text-purple-100 placeholder-purple-400 placeholder-opacity-50 text-lg"
                      placeholder="Ingresa tu nombre"
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-400 flex items-center gap-2 bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-500 border-opacity-30">
                      <span className="text-red-400">⚠</span> {submitError}
                    </p>
                  )}

                  {hasRegistered && (
                    <p className="text-sm text-green-400 flex items-center gap-2 font-medium bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-500 border-opacity-30">
                      <span className="text-green-400">✓</span> ¡Registrado exitosamente!
                    </p>
                  )}

                  <button
                    onClick={handleSubmit}
                    style={{ backgroundColor: '#7145d6' }}
                    className="w-full py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl"
                  >
                    Registrar
                  </button>
                </div>

                <div className="mt-8 p-5 bg-gray-900 bg-opacity-50 rounded-xl border border-purple-500 border-opacity-20">
                  <p className="text-sm text-purple-300 flex items-center gap-3">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">Solo puedes registrarte una vez</span>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div style={{ backgroundColor: '#7145d6' }} className="p-3 rounded-xl shadow-lg">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-purple-100">Lista de Usuarios</h2>
                </div>

                {loading ? (
                  <div className="text-center py-16 bg-gray-900 bg-opacity-40 rounded-2xl border border-purple-500 border-opacity-20">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-purple-400"></div>
                    <p className="mt-6 text-purple-300 text-lg">Cargando usuarios...</p>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-16 bg-gray-900 bg-opacity-40 rounded-2xl border border-purple-500 border-opacity-20">
                    <Trophy className="w-20 h-20 text-purple-600 mx-auto mb-6 opacity-50" />
                    <p className="text-purple-300 text-xl font-semibold">No hay usuarios registrados</p>
                    <p className="text-purple-400 text-base mt-3">¡Sé el primero en reclamar la corona!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-5 rounded-xl transition-all bg-gradient-to-r from-gray-900 to-purple-900 bg-opacity-60 border-2 border-purple-500 border-opacity-30 hover:border-opacity-50 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            style={{ backgroundColor: '#7145d6' }}
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg"
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-purple-100 text-lg">{entry.name}</p>
                            <p className="text-sm text-purple-400">
                              {new Date(entry.created_at).toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        {index === 0 && (
                          <Crown className="w-8 h-8 text-yellow-400" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}