<template>
  <div>
    <h1>2019 - 20 Fall</h1>
    <modal name="hello-world">
      {{ moreInfo }}
    </modal>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      styleClass="vgt-table condensed bordered striped"
      :sort-options="{
        enabled: true,
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 6,
        position: 'bottom',
        perPageDropdown: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        dropdownAllowAll: false,
        setCurrentPage: 2,
        nextLabel: 'next',
        prevLabel: 'prev',
        rowsPerPageLabel: 'Rows per page',
        ofLabel: 'of',
        pageLabel: 'page', // for 'pages' mode
        allLabel: 'All',
      }">
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'actions'" v-on:click="moreInfoModel(props)">
          <button type="button" class="btn btn-primary">View Details</button>
        </span>
        <span v-else> {{ props.formattedRow[props.column.field] }} </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'my-component',
  data() {
    return {
      moreInfo: 'more information about the course',
      expandedIds: [],
      columns: [
        {
          label: 'Status',
          field: 'status',
          filterOptions: {
            placeholder: 'All',
            enabled: true,
            filterDropdownItems: [
              {text: 'Open', value: 'O'},
              {text: 'Closed', value: 'C'}
            ]
          }
        },
        {
          label: 'Name',
          field: 'name',
          filterOptions: {
            placeholder: 'filter name',
            enabled: true
          }
        },
        {
          label: 'Department',
          field: 'department',
          filterOptions: {
            placeholder: 'All',
            enabled: true,
            filterDropdownItems: [
              {text: "africa and the americas", value: "AFAM"},
              {text: "american conversation", value: "AMCON"},
              {text: "american studies", value: "AMST"},
              {text: "art and art history", value: "ART"},
              {text: "asian studies", value: "ASIAN"},
              {text: "biology", value: "BIO"},
              {text: "biomedical studies", value: "BMED"},
              {text: "biomolecular science", value: "BMOLS"},
              {text: "chemistry", value: "CHEM"},
              {text: "chinese", value: "CHIN"},
              {text: "classics", value: "CLASS"},
              {text: "computer science", value: "CSCI"},
              {text: "dance", value: "DANCE"},
              {text: "economics", value: "ECON"},
              {text: "education", value: "EDUC"},
              {text: "english", value: "ENGL"},
              {text: "environmental studies", value: "ENVST"},
              {text: "exercise science activity", value: "ESAC"},
              {text: "exercise science theory", value: "ESTH"},
              {text: "family studies", value: "FAMST"},
              {text: "film studies", value: "FILM"},
              {text: "french", value: "FREN"},
              {text: "gender studies", value: "WMGST"},
              {text: "german", value: "GERM"},
              {text: "great conversation", value: "GCON"},
              {text: "greek", value: "GREEK"},
              {text: "hispanic studies", value: "HSPST"},
              {text: "history", value: "HIST"},
              {text: "integrative studies", value: "IS"},
              {text: "interdepartmental", value: "INTD"},
              {text: "interdisciplinary fine arts", value: "IDFA"},
              {text: "interdisciplinary", value: "ID"},
              {text: "japanese", value: "JAPAN"},
              {text: "latin", value: "LATIN"},
              {text: "linguistics", value: "LNGST"},
              {text: "management studies", value: "MGMT"},
              {text: "math/stat/csci", value: "MSCS"},
              {text: "mathematics", value: "MATH"},
              {text: "media studies", value: "MEDIA"},
              {text: "medieval studies", value: "MEDVL"},
              {text: "music performance", value: "MUSPF"},
              {text: "music", value: "MUSIC"},
              {text: "neuroscience", value: "NEURO"},
              {text: "norwegian", value: "NORW"},
              {text: "nursing", value: "NURS"},
              {text: "philosphy", value: "PHIL"},
              {text: "physics", value: "PHYS"},
              {text: "political science", value: "PSCI"},
              {text: "psychology", value: "PSYCH"},
              {text: "religion", value: "REL"},
              {text: "russian studies", value: "RUSSN"},
              {text: "science conversation", value: "SCICN"},
              {text: "social work", value: "SWRK"},
              {text: "sociology and anthropology", value: "SOAN"},
              {text: "spanish", value: "SPAN"},
              {text: "statistics", value: "STAT"},
              {text: "theater", value: "THEAT"},
              {text: "womens and gender studies", value: "WMGST"},
              {text: "writing", value: "WRIT"}
            ]
          }
        },
        {
          label: 'Number',
          field: 'number',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Days',
          field: 'days',
          filterOptions: {
            placeholder: 'All',
            enabled: true,
            filterDropdownItems: [
              {text: 'MWF', value: 'MWF'},
              {text: 'TTh', value: 'TTh'},
              {text: 'M-F', value: 'M-F'},
            ]
          }
        },
        {
          label: 'Times',
          field: 'times',
          filterOptions: {
            placeholder: 'All',
            enabled: true,
            filterDropdownItems: [
              {text: '', value: ''}
            ]
          }
        },
        {
          label: 'Prof',
          field: 'prof',
          filterOptions: {
            placeholder: 'filter prof',
            enabled: true
          }
        },
        {
          label: 'Rating',
          field: 'rating',
          type: 'number',
        },
        {
          label: 'Difficulty',
          field: 'difficulty',
          type: 'number',
        },
        {
          label: 'Reviews',
          field: 'reviews',
          type: 'number',
        },
        {
          label: 'Actions',
          field: 'actions'
        },
      ],
      rows: [],
    };
  },
  created() {
    axios.get('api/courses?term=20191&type=class').then(response => {
      this.rows = response.data.courses;
    });
  },
  methods: {
    moreInfoModel(props) {
      this.moreInfo = props.row.description;
      this.show();
    },
    show() {
      this.$modal.show('hello-world');
    },
    hide() {
      this.$modal.hide('hello-world');
    },
  }
};
</script>