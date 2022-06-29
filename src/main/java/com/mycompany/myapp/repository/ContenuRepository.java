package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Contenu;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Contenu entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContenuRepository extends JpaRepository<Contenu, Long> {}
