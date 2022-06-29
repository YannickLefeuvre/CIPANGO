package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Contenant;
import com.mycompany.myapp.repository.ContenantRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Contenant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ContenantResource {

    private final Logger log = LoggerFactory.getLogger(ContenantResource.class);

    private static final String ENTITY_NAME = "contenant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContenantRepository contenantRepository;

    public ContenantResource(ContenantRepository contenantRepository) {
        this.contenantRepository = contenantRepository;
    }

    /**
     * {@code POST  /contenants} : Create a new contenant.
     *
     * @param contenant the contenant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contenant, or with status {@code 400 (Bad Request)} if the contenant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contenants")
    public ResponseEntity<Contenant> createContenant(@Valid @RequestBody Contenant contenant) throws URISyntaxException {
        log.debug("REST request to save Contenant : {}", contenant);
        if (contenant.getId() != null) {
            throw new BadRequestAlertException("A new contenant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Contenant result = contenantRepository.save(contenant);
        return ResponseEntity
            .created(new URI("/api/contenants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contenants/:id} : Updates an existing contenant.
     *
     * @param id the id of the contenant to save.
     * @param contenant the contenant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contenant,
     * or with status {@code 400 (Bad Request)} if the contenant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contenant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contenants/{id}")
    public ResponseEntity<Contenant> updateContenant(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Contenant contenant
    ) throws URISyntaxException {
        log.debug("REST request to update Contenant : {}, {}", id, contenant);
        if (contenant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contenant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contenantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Contenant result = contenantRepository.save(contenant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contenant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contenants/:id} : Partial updates given fields of an existing contenant, field will ignore if it is null
     *
     * @param id the id of the contenant to save.
     * @param contenant the contenant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contenant,
     * or with status {@code 400 (Bad Request)} if the contenant is not valid,
     * or with status {@code 404 (Not Found)} if the contenant is not found,
     * or with status {@code 500 (Internal Server Error)} if the contenant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contenants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Contenant> partialUpdateContenant(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Contenant contenant
    ) throws URISyntaxException {
        log.debug("REST request to partial update Contenant partially : {}, {}", id, contenant);
        if (contenant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contenant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contenantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Contenant> result = contenantRepository
            .findById(contenant.getId())
            .map(existingContenant -> {
                if (contenant.getNom() != null) {
                    existingContenant.setNom(contenant.getNom());
                }
                if (contenant.getIsCapital() != null) {
                    existingContenant.setIsCapital(contenant.getIsCapital());
                }
                if (contenant.getIcone() != null) {
                    existingContenant.setIcone(contenant.getIcone());
                }
                if (contenant.getIconeContentType() != null) {
                    existingContenant.setIconeContentType(contenant.getIconeContentType());
                }
                if (contenant.getAbsisce() != null) {
                    existingContenant.setAbsisce(contenant.getAbsisce());
                }
                if (contenant.getOrdonnee() != null) {
                    existingContenant.setOrdonnee(contenant.getOrdonnee());
                }
                if (contenant.getArriereplan() != null) {
                    existingContenant.setArriereplan(contenant.getArriereplan());
                }
                if (contenant.getArriereplanContentType() != null) {
                    existingContenant.setArriereplanContentType(contenant.getArriereplanContentType());
                }

                return existingContenant;
            })
            .map(contenantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contenant.getId().toString())
        );
    }

    /**
     * {@code GET  /contenants} : get all the contenants.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contenants in body.
     */
    @GetMapping("/contenants")
    public List<Contenant> getAllContenants(@RequestParam(required = false) String filter) {
        if ("lienorigine-is-null".equals(filter)) {
            log.debug("REST request to get all Contenants where lienOrigine is null");
            return StreamSupport
                .stream(contenantRepository.findAll().spliterator(), false)
                .filter(contenant -> contenant.getLienOrigine() == null)
                .collect(Collectors.toList());
        }

        if ("liencible-is-null".equals(filter)) {
            log.debug("REST request to get all Contenants where lienCible is null");
            return StreamSupport
                .stream(contenantRepository.findAll().spliterator(), false)
                .filter(contenant -> contenant.getLienCible() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Contenants");
        return contenantRepository.findAll();
    }

    /**
     * {@code GET  /contenants/:id} : get the "id" contenant.
     *
     * @param id the id of the contenant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contenant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contenants/{id}")
    public ResponseEntity<Contenant> getContenant(@PathVariable Long id) {
        log.debug("REST request to get Contenant : {}", id);
        Optional<Contenant> contenant = contenantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(contenant);
    }

    /**
     * {@code DELETE  /contenants/:id} : delete the "id" contenant.
     *
     * @param id the id of the contenant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contenants/{id}")
    public ResponseEntity<Void> deleteContenant(@PathVariable Long id) {
        log.debug("REST request to delete Contenant : {}", id);
        contenantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
