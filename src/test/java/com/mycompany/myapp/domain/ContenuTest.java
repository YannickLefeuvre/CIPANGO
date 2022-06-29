package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContenuTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contenu.class);
        Contenu contenu1 = new Contenu();
        contenu1.setId(1L);
        Contenu contenu2 = new Contenu();
        contenu2.setId(contenu1.getId());
        assertThat(contenu1).isEqualTo(contenu2);
        contenu2.setId(2L);
        assertThat(contenu1).isNotEqualTo(contenu2);
        contenu1.setId(null);
        assertThat(contenu1).isNotEqualTo(contenu2);
    }
}
