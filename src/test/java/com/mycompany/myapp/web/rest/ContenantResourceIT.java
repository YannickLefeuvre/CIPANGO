package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Contenant;
import com.mycompany.myapp.repository.ContenantRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ContenantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContenantResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_CAPITAL = false;
    private static final Boolean UPDATED_IS_CAPITAL = true;

    private static final byte[] DEFAULT_ICONE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ICONE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ICONE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ICONE_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_ABSISCE = 1;
    private static final Integer UPDATED_ABSISCE = 2;

    private static final Integer DEFAULT_ORDONNEE = 1;
    private static final Integer UPDATED_ORDONNEE = 2;

    private static final byte[] DEFAULT_ARRIEREPLAN = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ARRIEREPLAN = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ARRIEREPLAN_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ARRIEREPLAN_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/contenants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ContenantRepository contenantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContenantMockMvc;

    private Contenant contenant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Contenant createEntity(EntityManager em) {
        Contenant contenant = new Contenant()
            .nom(DEFAULT_NOM)
            .isCapital(DEFAULT_IS_CAPITAL)
            .icone(DEFAULT_ICONE)
            .iconeContentType(DEFAULT_ICONE_CONTENT_TYPE)
            .absisce(DEFAULT_ABSISCE)
            .ordonnee(DEFAULT_ORDONNEE)
            .arriereplan(DEFAULT_ARRIEREPLAN)
            .arriereplanContentType(DEFAULT_ARRIEREPLAN_CONTENT_TYPE);
        return contenant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Contenant createUpdatedEntity(EntityManager em) {
        Contenant contenant = new Contenant()
            .nom(UPDATED_NOM)
            .isCapital(UPDATED_IS_CAPITAL)
            .icone(UPDATED_ICONE)
            .iconeContentType(UPDATED_ICONE_CONTENT_TYPE)
            .absisce(UPDATED_ABSISCE)
            .ordonnee(UPDATED_ORDONNEE)
            .arriereplan(UPDATED_ARRIEREPLAN)
            .arriereplanContentType(UPDATED_ARRIEREPLAN_CONTENT_TYPE);
        return contenant;
    }

    @BeforeEach
    public void initTest() {
        contenant = createEntity(em);
    }

    @Test
    @Transactional
    void createContenant() throws Exception {
        int databaseSizeBeforeCreate = contenantRepository.findAll().size();
        // Create the Contenant
        restContenantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contenant)))
            .andExpect(status().isCreated());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeCreate + 1);
        Contenant testContenant = contenantList.get(contenantList.size() - 1);
        assertThat(testContenant.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testContenant.getIsCapital()).isEqualTo(DEFAULT_IS_CAPITAL);
        assertThat(testContenant.getIcone()).isEqualTo(DEFAULT_ICONE);
        assertThat(testContenant.getIconeContentType()).isEqualTo(DEFAULT_ICONE_CONTENT_TYPE);
        assertThat(testContenant.getAbsisce()).isEqualTo(DEFAULT_ABSISCE);
        assertThat(testContenant.getOrdonnee()).isEqualTo(DEFAULT_ORDONNEE);
        assertThat(testContenant.getArriereplan()).isEqualTo(DEFAULT_ARRIEREPLAN);
        assertThat(testContenant.getArriereplanContentType()).isEqualTo(DEFAULT_ARRIEREPLAN_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createContenantWithExistingId() throws Exception {
        // Create the Contenant with an existing ID
        contenant.setId(1L);

        int databaseSizeBeforeCreate = contenantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContenantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contenant)))
            .andExpect(status().isBadRequest());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = contenantRepository.findAll().size();
        // set the field null
        contenant.setNom(null);

        // Create the Contenant, which fails.

        restContenantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contenant)))
            .andExpect(status().isBadRequest());

        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIsCapitalIsRequired() throws Exception {
        int databaseSizeBeforeTest = contenantRepository.findAll().size();
        // set the field null
        contenant.setIsCapital(null);

        // Create the Contenant, which fails.

        restContenantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contenant)))
            .andExpect(status().isBadRequest());

        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllContenants() throws Exception {
        // Initialize the database
        contenantRepository.saveAndFlush(contenant);

        // Get all the contenantList
        restContenantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contenant.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].isCapital").value(hasItem(DEFAULT_IS_CAPITAL.booleanValue())))
            .andExpect(jsonPath("$.[*].iconeContentType").value(hasItem(DEFAULT_ICONE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].icone").value(hasItem(Base64Utils.encodeToString(DEFAULT_ICONE))))
            .andExpect(jsonPath("$.[*].absisce").value(hasItem(DEFAULT_ABSISCE)))
            .andExpect(jsonPath("$.[*].ordonnee").value(hasItem(DEFAULT_ORDONNEE)))
            .andExpect(jsonPath("$.[*].arriereplanContentType").value(hasItem(DEFAULT_ARRIEREPLAN_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].arriereplan").value(hasItem(Base64Utils.encodeToString(DEFAULT_ARRIEREPLAN))));
    }

    @Test
    @Transactional
    void getContenant() throws Exception {
        // Initialize the database
        contenantRepository.saveAndFlush(contenant);

        // Get the contenant
        restContenantMockMvc
            .perform(get(ENTITY_API_URL_ID, contenant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(contenant.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.isCapital").value(DEFAULT_IS_CAPITAL.booleanValue()))
            .andExpect(jsonPath("$.iconeContentType").value(DEFAULT_ICONE_CONTENT_TYPE))
            .andExpect(jsonPath("$.icone").value(Base64Utils.encodeToString(DEFAULT_ICONE)))
            .andExpect(jsonPath("$.absisce").value(DEFAULT_ABSISCE))
            .andExpect(jsonPath("$.ordonnee").value(DEFAULT_ORDONNEE))
            .andExpect(jsonPath("$.arriereplanContentType").value(DEFAULT_ARRIEREPLAN_CONTENT_TYPE))
            .andExpect(jsonPath("$.arriereplan").value(Base64Utils.encodeToString(DEFAULT_ARRIEREPLAN)));
    }

    @Test
    @Transactional
    void getNonExistingContenant() throws Exception {
        // Get the contenant
        restContenantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewContenant() throws Exception {
        // Initialize the database
        contenantRepository.saveAndFlush(contenant);

        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();

        // Update the contenant
        Contenant updatedContenant = contenantRepository.findById(contenant.getId()).get();
        // Disconnect from session so that the updates on updatedContenant are not directly saved in db
        em.detach(updatedContenant);
        updatedContenant
            .nom(UPDATED_NOM)
            .isCapital(UPDATED_IS_CAPITAL)
            .icone(UPDATED_ICONE)
            .iconeContentType(UPDATED_ICONE_CONTENT_TYPE)
            .absisce(UPDATED_ABSISCE)
            .ordonnee(UPDATED_ORDONNEE)
            .arriereplan(UPDATED_ARRIEREPLAN)
            .arriereplanContentType(UPDATED_ARRIEREPLAN_CONTENT_TYPE);

        restContenantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedContenant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedContenant))
            )
            .andExpect(status().isOk());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
        Contenant testContenant = contenantList.get(contenantList.size() - 1);
        assertThat(testContenant.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testContenant.getIsCapital()).isEqualTo(UPDATED_IS_CAPITAL);
        assertThat(testContenant.getIcone()).isEqualTo(UPDATED_ICONE);
        assertThat(testContenant.getIconeContentType()).isEqualTo(UPDATED_ICONE_CONTENT_TYPE);
        assertThat(testContenant.getAbsisce()).isEqualTo(UPDATED_ABSISCE);
        assertThat(testContenant.getOrdonnee()).isEqualTo(UPDATED_ORDONNEE);
        assertThat(testContenant.getArriereplan()).isEqualTo(UPDATED_ARRIEREPLAN);
        assertThat(testContenant.getArriereplanContentType()).isEqualTo(UPDATED_ARRIEREPLAN_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingContenant() throws Exception {
        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();
        contenant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContenantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contenant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contenant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchContenant() throws Exception {
        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();
        contenant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContenantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contenant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamContenant() throws Exception {
        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();
        contenant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContenantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contenant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContenantWithPatch() throws Exception {
        // Initialize the database
        contenantRepository.saveAndFlush(contenant);

        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();

        // Update the contenant using partial update
        Contenant partialUpdatedContenant = new Contenant();
        partialUpdatedContenant.setId(contenant.getId());

        partialUpdatedContenant
            .isCapital(UPDATED_IS_CAPITAL)
            .icone(UPDATED_ICONE)
            .iconeContentType(UPDATED_ICONE_CONTENT_TYPE)
            .absisce(UPDATED_ABSISCE)
            .arriereplan(UPDATED_ARRIEREPLAN)
            .arriereplanContentType(UPDATED_ARRIEREPLAN_CONTENT_TYPE);

        restContenantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContenant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContenant))
            )
            .andExpect(status().isOk());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
        Contenant testContenant = contenantList.get(contenantList.size() - 1);
        assertThat(testContenant.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testContenant.getIsCapital()).isEqualTo(UPDATED_IS_CAPITAL);
        assertThat(testContenant.getIcone()).isEqualTo(UPDATED_ICONE);
        assertThat(testContenant.getIconeContentType()).isEqualTo(UPDATED_ICONE_CONTENT_TYPE);
        assertThat(testContenant.getAbsisce()).isEqualTo(UPDATED_ABSISCE);
        assertThat(testContenant.getOrdonnee()).isEqualTo(DEFAULT_ORDONNEE);
        assertThat(testContenant.getArriereplan()).isEqualTo(UPDATED_ARRIEREPLAN);
        assertThat(testContenant.getArriereplanContentType()).isEqualTo(UPDATED_ARRIEREPLAN_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateContenantWithPatch() throws Exception {
        // Initialize the database
        contenantRepository.saveAndFlush(contenant);

        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();

        // Update the contenant using partial update
        Contenant partialUpdatedContenant = new Contenant();
        partialUpdatedContenant.setId(contenant.getId());

        partialUpdatedContenant
            .nom(UPDATED_NOM)
            .isCapital(UPDATED_IS_CAPITAL)
            .icone(UPDATED_ICONE)
            .iconeContentType(UPDATED_ICONE_CONTENT_TYPE)
            .absisce(UPDATED_ABSISCE)
            .ordonnee(UPDATED_ORDONNEE)
            .arriereplan(UPDATED_ARRIEREPLAN)
            .arriereplanContentType(UPDATED_ARRIEREPLAN_CONTENT_TYPE);

        restContenantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContenant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContenant))
            )
            .andExpect(status().isOk());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
        Contenant testContenant = contenantList.get(contenantList.size() - 1);
        assertThat(testContenant.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testContenant.getIsCapital()).isEqualTo(UPDATED_IS_CAPITAL);
        assertThat(testContenant.getIcone()).isEqualTo(UPDATED_ICONE);
        assertThat(testContenant.getIconeContentType()).isEqualTo(UPDATED_ICONE_CONTENT_TYPE);
        assertThat(testContenant.getAbsisce()).isEqualTo(UPDATED_ABSISCE);
        assertThat(testContenant.getOrdonnee()).isEqualTo(UPDATED_ORDONNEE);
        assertThat(testContenant.getArriereplan()).isEqualTo(UPDATED_ARRIEREPLAN);
        assertThat(testContenant.getArriereplanContentType()).isEqualTo(UPDATED_ARRIEREPLAN_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingContenant() throws Exception {
        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();
        contenant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContenantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, contenant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contenant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchContenant() throws Exception {
        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();
        contenant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContenantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contenant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamContenant() throws Exception {
        int databaseSizeBeforeUpdate = contenantRepository.findAll().size();
        contenant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContenantMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(contenant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Contenant in the database
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteContenant() throws Exception {
        // Initialize the database
        contenantRepository.saveAndFlush(contenant);

        int databaseSizeBeforeDelete = contenantRepository.findAll().size();

        // Delete the contenant
        restContenantMockMvc
            .perform(delete(ENTITY_API_URL_ID, contenant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Contenant> contenantList = contenantRepository.findAll();
        assertThat(contenantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
