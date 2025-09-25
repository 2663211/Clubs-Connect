import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CSO_Member.css';

import { supabase } from '../supabaseClient';

export default function CSO_member() {
  //const { entityId } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState(null);
  const [entities, setEntities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [csoName, setCsoName] = useState(' ');
  const [csoID, setCsoID] = useState(' ');
  const [csoLogo, setCsoLogo] = useState(' ');
  const [csoCluster, setCsoCluster] = useState(' ');
  const [csoDescription, setCsoDescription] = useState(' ');

  useEffect(() => {
    fetchUser();
    // fetchMembership();
  }, []);

  async function fetchUser() {
    const {
      //fetch user details from Supabase
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
    console.log(user.id);

    if (user) {
      const { data: csoData } = await supabase //fetch CSO's of which I am a member of
        .from('cso_members')
        .select('cso_id')
        .eq('student_number', user.id);

      //console.log(csoData);
      //setMember(csoData);
      if (csoData) {
        setLoading(true);
        csoData.forEach(club => {
          // memberships.push(club.cso_id);
          setMemberships([...memberships, club.cso_id]);
          console.log(club.cso_id);

          fetchCSO(club.cso_id);
        });
        setLoading(false);
      }
    }
  }
  console.log(memberships);
  async function fetchCSO(cso) {
    try {
      const { data: csoDetails, error } = await supabase //fetch CSO's of which I am a member of
        .from('cso')
        .select(
          `id,
                    name,
                    description,
                    cluster,
                    logo_url`
        )
        .eq('id', cso)
        .single();

      if (error) throw error;
      //console.log(csoData);
      //setMember(csoData);
      //console.log(csoDetails);

      if (csoDetails) {
        // setEntities([...entities, {
        //     csoID: csoDetails.id, csoName: csoDetails.name, csoDescription: csoDetails.description,
        //     csoCluster: csoDetails.cluster, csoLogo: csoDetails.logo_url
        // }]);
        //console.log(csoDetails.name);
        //setEntities([...entities, csoDetails]);
        setEntities(entities => [...entities, csoDetails]);
      }
    } catch (err) {
      console.error('Failed to fetch entities:', err.message);
    } finally {
    }
  }

  console.log(entities);
  const uniqueArray = entities.filter(
    (obj, index, self) => index === self.findIndex(t => t.id === obj.id)
  );

  return (
    <article>
      <section className="CSO_member">
        <h2>This is where group memberships will go</h2>
      </section>
      <section className="entities-list">
        {loading ? (
          <p>Loading entities...</p>
        ) : entities.length === 0 ? (
          <p>No entities found.</p>
        ) : (
          uniqueArray.map(entity => (
            <article
              key={entity.id}
              className="entity-card"
              onClick={() => navigate(`/entities/${entity.id}`)}
            >
              {entity.logo_url && (
                <img src={entity.logo_url} alt={entity.name} className="entity-logo" />
              )}
              <header>
                <h2>{entity.name}</h2>
                <p className="entity-cluster">{entity.cluster}</p>
                {entity.description && (
                  <section className="entity-description">
                    <p>{entity.description}</p>
                  </section>
                )}
              </header>
            </article>
          ))
        )}{' '}
      </section>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
    </article>
  );
}
