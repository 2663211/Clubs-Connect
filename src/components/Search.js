import React, { useEffect, useState } from 'react';
import StudentHeader from './StudentHeader';
import searchIcon from '../images/icons8-search.gif';
import '../styles/Search.css';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router';
import FollowButton from './FollowButton';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [csos, setCsos] = useState([]); // store all CSOs
  const [filteredCSOs, setFilteredCSOs] = useState([]); // store search results
  const navigate = useNavigate();

  // Fetch all CSOs once
  useEffect(() => {
    const fetchCsos = async () => {
      const { data: csoData, error: csoError } = await supabase
        .from('cso')
        .select('id, name, cluster, logo_url');

      if (csoError) {
        console.error('Error fetching CSOs:', csoError.message);
        return;
      }

      setCsos(csoData);
      setFilteredCSOs(csoData); // initially show all
    };

    fetchCsos();
  }, []);

  // Filter when searchQuery changes
  useEffect(() => {
    const results = csos.filter(cso => cso.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredCSOs(results);
  }, [searchQuery, csos]);

  function SearchButton(csoName) {
    const cso = csos.find(c => c.name.toLowerCase() === csoName.toLowerCase());
    if (cso) {
      navigate(`/entities/${cso.id}`);
    }
  }

  return (
    <>
      {/* <StudentHeader /> */}
      <section className="search-header">
        <input
          type="search"
          id="Clubsearch"
          name="club-search"
          placeholder="Search for CSO"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <img
          src={searchIcon}
          id="search-icon"
          alt="search-gif"
          onClick={() => SearchButton(searchQuery)}
        />
      </section>

      {searchQuery === '' ? (
        ' '
      ) : (
        <ul className="search-list">
          {filteredCSOs.length > 0 ? (
            filteredCSOs.map(cso => (
              <li
                key={cso.id}
                className="search-item"
                onClick={() => navigate(`/entities/${cso.id}`)}
              >
                <img src={searchIcon} alt="search-gif" id="search-icon" />
                <img src={cso.logo_url} alt="cso logo" id="cso-logo" />
                <article className="csoContent">
                  <p>{cso.name}</p>
                  <p>{cso.cluster}</p>
                </article>
              </li>
            ))
          ) : (
            <p>No results found</p>
          )}
        </ul>
      )}
    </>
  );
}
