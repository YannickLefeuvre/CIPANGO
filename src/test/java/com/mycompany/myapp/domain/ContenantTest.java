package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContenantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contenant.class);
        Contenant contenant1 = new Contenant();
        contenant1.setId(1L);
        Contenant contenant2 = new Contenant();
        contenant2.setId(contenant1.getId());
        assertThat(contenant1).isEqualTo(contenant2);
        contenant2.setId(2L);
        assertThat(contenant1).isNotEqualTo(contenant2);
        contenant1.setId(null);
        assertThat(contenant1).isNotEqualTo(contenant2);
    }
}
