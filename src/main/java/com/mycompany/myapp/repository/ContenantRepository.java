package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Contenant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Contenant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContenantRepository extends JpaRepository<Contenant, Long> {}
