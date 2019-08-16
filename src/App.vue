<template>
  <div id="app">
    <span v-if="year !== 2019">NOT CURRENT YEAR</span>
    <button v-on:click="getUserTermCourses()">My Courses</button>
    <button v-on:click="getTermCourses()">Term Courses</button>
    <div id="term-display">
      <div>
        <button v-on:click="changeSemester(-1)"> < </button>
        <h1>{{ year }} {{ this.semesterNumToName() }} </h1>
        <button v-on:click="changeSemester(1)"> > </button>
      </div>
    </div>
    <modal name="hello-world"
           :width="1000"
           :height="450"
    >
      <div style="padding:30px">
        <h3>Prereqs</h3>
        {{ moreInfo.prereqs }}
        <h3>Description</h3>
        {{ moreInfo.description }}
        <h3>Notes</h3>
        {{ moreInfo.notes }}
      </div>
    </modal>
    <vue-good-table
      :fixed-header="true"
      max-height="600px"
      :columns="columns"
      :rows="rows"
      styleClass="vgt-table condensed bordered striped"
      :sort-options="{
        enabled: true,
      }"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'actions'">
          <button type="button" class="btn btn-primary" v-on:click="moreInfoModel(props)">View Details</button>
          <button type="button" class="btn btn-primary" v-on:click="addCourse(props)">Add Course</button>
        </span>
        <span v-else> {{ props.formattedRow[props.column.field] }} </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import axios from "axios";
import DepartmentDropDownItems from "./components/DepartmentDropDownItems.vue";

export default {
  name: 'my-component',
  data() {
    return {
      year: 2019,
      semester: 1,
      moreInfo: {
        'description': '',
        'prereqs': '',
        'notes': '',
      },
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
          },
          tdClass: 'text-center',
          // tdClass: this.tdStatusClassFunc
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
          },
          type: 'number',
          tdClass: 'text-center',
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
        // {
        //   label: 'Prof',
        //   field: 'prof',
        //   filterOptions: {
        //     placeholder: 'filter prof',
        //     enabled: true
        //   }
        // },
        // {
        //   label: 'Rating',
        //   field: 'rating',
        //   type: 'number',
        // },
        // {
        //   label: 'Difficulty',
        //   field: 'difficulty',
        //   type: 'number',
        // },
        // {
        //   label: 'Reviews',
        //   field: 'reviews',
        //   type: 'number',
        // },
        {
          label: 'Prereqs',
          field: this.prereqsFieldFn,
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
      this.moreInfo.description = props.row.description;
      this.moreInfo.prereqs = props.row.prerequisites;
      this.moreInfo.description = props.row.description;
      this.moreInfo.notes = props.row.notes;
      this.show();
    },
    show() {
      this.$modal.show('hello-world');
    },
    hide() {
      this.$modal.hide('hello-world');
    },
    getTermCourses() {
      axios.get(`api/courses?term=${this.year}${this.semester}&type=class`).then(response => {
        this.rows = response.data.courses;
      });
    },
    changeSemester(change) {
      if (this.semester + change > 5 && this.year < 2022) {
        this.year += 1;
        this.semester = 1;
      } else if (this.semester + change < 1 && this.year > 2015) {
        this.year -= 1;
        this.semester = 5;
      } else if (this.semester + change <= 5 && this.semester + change >= 1) {
        this.semester += change;
      }
      this.getTermCourses();
    },
    getUserTermCourses() {
      axios.get(`api/terms?term=${this.year}${this.semester}`).then(response => {
        this.rows = response.data[0].courses;
      });
    },
    semesterNumToName() {
      var semesterName = '';
      switch (this.semester) {
      case 1:
        semesterName = 'Fall';
        break;
      case 2:
        semesterName = 'Interim';
        break;
      case 3:
        semesterName = 'Spring';
        break;
      case 4:
        semesterName = 'Summer session 1';
        break;
      case 5:
        semesterName = 'Summer session 2';
        break;
      default:
        semesterName = 'Unknown';
        break;
      }
      return semesterName;
    },
    prereqsFieldFn(rowObj) {
      return rowObj.prerequisites === 'f' ? 'no' : 'yes';
    },
    tdStatusClassFunc(row) {
      return row.status === 'C' ? 'red-class' : 'green-class';
    },
    // addCourse(row) {
      
    // }
  }
};
</script>

<style>

.text-center {
  text-align: center;
}

.red-class {
  background: red;
  color: red;
}

.green-class {
  background: #38CD3D;
  color: green;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#term-display {
  display: flex;
  /*background: blue;*/
  text-align: center;
}

#term-display div {
  display: flex;
  margin: 0px auto;
}

#term-dislay div button {
}
</style>
