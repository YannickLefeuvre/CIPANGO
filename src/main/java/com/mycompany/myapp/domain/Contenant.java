package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Contenant.
 */
@Entity
@Table(name = "contenant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Contenant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "is_capital", nullable = false)
    private Boolean isCapital;

    @Lob
    @Column(name = "icone")
    private byte[] icone;

    @Column(name = "icone_content_type")
    private String iconeContentType;

    @Column(name = "absisce")
    private Integer absisce;

    @Column(name = "ordonnee")
    private Integer ordonnee;

    @Lob
    @Column(name = "arriereplan")
    private byte[] arriereplan;

    @Column(name = "arriereplan_content_type")
    private String arriereplanContentType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "villeOrigine", "villeCible" }, allowSetters = true)
    private Lien lien;

    @ManyToOne
    @JsonIgnoreProperties(value = { "contenantino" }, allowSetters = true)
    private Contenu maison;

    @JsonIgnoreProperties(value = { "villeOrigine", "villeCible" }, allowSetters = true)
    @OneToOne(mappedBy = "villeOrigine")
    private Lien lienOrigine;

    @JsonIgnoreProperties(value = { "villeOrigine", "villeCible" }, allowSetters = true)
    @OneToOne(mappedBy = "villeCible")
    private Lien lienCible;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Contenant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Contenant nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Boolean getIsCapital() {
        return this.isCapital;
    }

    public Contenant isCapital(Boolean isCapital) {
        this.setIsCapital(isCapital);
        return this;
    }

    public void setIsCapital(Boolean isCapital) {
        this.isCapital = isCapital;
    }

    public byte[] getIcone() {
        return this.icone;
    }

    public Contenant icone(byte[] icone) {
        this.setIcone(icone);
        return this;
    }

    public void setIcone(byte[] icone) {
        this.icone = icone;
    }

    public String getIconeContentType() {
        return this.iconeContentType;
    }

    public Contenant iconeContentType(String iconeContentType) {
        this.iconeContentType = iconeContentType;
        return this;
    }

    public void setIconeContentType(String iconeContentType) {
        this.iconeContentType = iconeContentType;
    }

    public Integer getAbsisce() {
        return this.absisce;
    }

    public Contenant absisce(Integer absisce) {
        this.setAbsisce(absisce);
        return this;
    }

    public void setAbsisce(Integer absisce) {
        this.absisce = absisce;
    }

    public Integer getOrdonnee() {
        return this.ordonnee;
    }

    public Contenant ordonnee(Integer ordonnee) {
        this.setOrdonnee(ordonnee);
        return this;
    }

    public void setOrdonnee(Integer ordonnee) {
        this.ordonnee = ordonnee;
    }

    public byte[] getArriereplan() {
        return this.arriereplan;
    }

    public Contenant arriereplan(byte[] arriereplan) {
        this.setArriereplan(arriereplan);
        return this;
    }

    public void setArriereplan(byte[] arriereplan) {
        this.arriereplan = arriereplan;
    }

    public String getArriereplanContentType() {
        return this.arriereplanContentType;
    }

    public Contenant arriereplanContentType(String arriereplanContentType) {
        this.arriereplanContentType = arriereplanContentType;
        return this;
    }

    public void setArriereplanContentType(String arriereplanContentType) {
        this.arriereplanContentType = arriereplanContentType;
    }

    public Lien getLien() {
        return this.lien;
    }

    public void setLien(Lien lien) {
        this.lien = lien;
    }

    public Contenant lien(Lien lien) {
        this.setLien(lien);
        return this;
    }

    public Contenu getMaison() {
        return this.maison;
    }

    public void setMaison(Contenu contenu) {
        this.maison = contenu;
    }

    public Contenant maison(Contenu contenu) {
        this.setMaison(contenu);
        return this;
    }

    public Lien getLienOrigine() {
        return this.lienOrigine;
    }

    public void setLienOrigine(Lien lien) {
        if (this.lienOrigine != null) {
            this.lienOrigine.setVilleOrigine(null);
        }
        if (lien != null) {
            lien.setVilleOrigine(this);
        }
        this.lienOrigine = lien;
    }

    public Contenant lienOrigine(Lien lien) {
        this.setLienOrigine(lien);
        return this;
    }

    public Lien getLienCible() {
        return this.lienCible;
    }

    public void setLienCible(Lien lien) {
        if (this.lienCible != null) {
            this.lienCible.setVilleCible(null);
        }
        if (lien != null) {
            lien.setVilleCible(this);
        }
        this.lienCible = lien;
    }

    public Contenant lienCible(Lien lien) {
        this.setLienCible(lien);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contenant)) {
            return false;
        }
        return id != null && id.equals(((Contenant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Contenant{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", isCapital='" + getIsCapital() + "'" +
            ", icone='" + getIcone() + "'" +
            ", iconeContentType='" + getIconeContentType() + "'" +
            ", absisce=" + getAbsisce() +
            ", ordonnee=" + getOrdonnee() +
            ", arriereplan='" + getArriereplan() + "'" +
            ", arriereplanContentType='" + getArriereplanContentType() + "'" +
            "}";
    }
}
