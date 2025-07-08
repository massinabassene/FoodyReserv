import { useEffect, useState } from 'react';

export default function CommandesLivreur() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/commandes/statut/EN_COURS')
      .then(res => res.json())
      .then(data => {
        setCommandes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Mes commandes en cours</h2>
      <ul>
        {commandes.map(cmd => (
          <li key={cmd.id}>
            Commande #{cmd.id} - {cmd.statut}
            {/* Ajouter bouton pour marquer comme livré */}
          </li>
        ))}
      </ul>
    </div>
  );
}