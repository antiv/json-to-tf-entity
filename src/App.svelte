<script lang="ts">
  import * as jsonTest from './data/test.json';
  import { createEntity, getCapital } from './utils/helper';
  import Tabs from './widgets/Tabs.svelte';

  let entityName = 'Worklog';
  let modelPackage = 'dt1.test.from.json';
  let response = {};
  let props = [];
  let json = JSON.stringify(jsonTest, null, 4);

  $: response = createEntity(modelPackage, entityName, props);

  $: if (json) {
    try {
      props = Object.entries(JSON.parse(json)).map((e) => {
        return {
          name: e[0],
          type: Array.isArray(e[1]) ? `list<${getCapital(e[0])}>` : typeof e[1],
          val: e[1],
        };
      });
    } catch (error) {
      console.error(error);
      //TODO: show message
    }
  }

  $: tabs = Object.entries(response).map((item, idx) => {
    return { label: item[0], value: idx, content: item[1] };
  });
</script>

<nav class="navbar navbar-dark bg-dark">
  <div class="container-fluid">
    <span class="navbar-brand mb-0 h1">JsonToEntity</span>
  </div>
</nav>
<div class="container mt-5">
  <div class="row">
    <div class="col-4 pt-2">
      <div class="mb-3">
        <label for="modelPackage" class="form-label">Package:</label>
        <input
          type="text"
          class="form-control bg-dark"
          name="modelPackage"
          id="modelPackage"
          bind:value={modelPackage}
        />
      </div>
      <div class="mb-3">
        <label for="entityName" class="form-label">Main Entity Name:</label>
        <input
          type="text"
          class="form-control bg-dark"
          name="entityName"
          id="entityName"
          bind:value={entityName}
        />
      </div>

      <div class="mb-3">
        <label for="json" class="form-label">JSON String:</label>
        <textarea
          class="form-control bg-dark"
          id="json"
          name="json"
          rows="30"
          bind:value={json}
        />
      </div>
    </div>
    <div class="col-8"><Tabs items={tabs} /></div>
  </div>
</div>
