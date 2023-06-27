const report_form = document.getElementById("report-form");
const main_report = document.getElementById("main-report");
const search_btn = document.getElementById("search");
const loading_btn = document.getElementById("loading");
const tbody = document.getElementById("sections");
const tbody_tonnage = document.getElementById("tonnage-sections");
const service_location = document.getElementById("service-location");
const services = document.getElementById("services");
const tonnages = document.getElementById("tonnages");
const show_service_btn = document.getElementById("show-hide-service");
const show_tonnage_btn = document.getElementById("show-hide-tonnage");
const excel = document.getElementById("excel");
const excel2 = document.getElementById("excel2");
const excel3 = document.getElementById("excel3");

excel.addEventListener("click", () => {
  TableToExcel.convert(document.getElementById("table1"));
});
excel2.addEventListener("click", () => {
  TableToExcel.convert(document.getElementById("table2"));
});
excel3.addEventListener("click", () => {
  TableToExcel.convert(document.getElementById("table3"));
});

show_service_btn.addEventListener("click", () => {
  if (main_report.classList.contains("d-none")) {
    services.classList.add("d-none");
    tonnages.classList.add("d-none");
    main_report.classList.remove("d-none");
  } else {
    services.classList.remove("d-none");
    tonnages.classList.add("d-none");
    main_report.classList.add("d-none");
  }
});
show_tonnage_btn.addEventListener("click", () => {
  if (main_report.classList.contains("d-none")) {
    services.classList.add("d-none");
    tonnages.classList.add("d-none");
    main_report.classList.remove("d-none");
  } else {
    services.classList.add("d-none");
    tonnages.classList.remove("d-none");
    main_report.classList.add("d-none");
  }
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

report_form.addEventListener("submit", async (event) => {
  search_btn.classList.add("d-none");
  loading_btn.classList.remove("d-none");
  search_btn.disabled = true;
  tbody.innerHTML = "";
  tbody_tonnage.innerHTML = "";
  event.preventDefault();
  const pile = document.getElementById("pile").value;
  const { data: pileInfo } = await axios.post("/report/pile", { pile });
  const mine_blocks = pileInfo.data.blocks;
  let start_at = pileInfo.data.start_at;
  let end_at = pileInfo.data.end_at;
  if (!start_at) {
    search_btn.classList.remove("d-none");
  loading_btn.classList.add("d-none");
  search_btn.disabled = false;
    return
  }
  if (!end_at) {
    end_at = formatDate(new Date());
  }
  const workdays = [];
  Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
  };
  let first_day = new Date(start_at);
  let first_day_for_prev_day = new Date(start_at);
  let last_day = new Date(end_at);
  let start = start_at.split(" ")[0];
  let end = end_at.split(" ")[0];

  const { data: saha } = await axios.post("/report/saha", {
    start_at: start,
    end_at: end,
  });
  for (let i = 0; i < saha.length; i++) {
    delete saha[i].id;
    delete saha[i].created_at;
    delete saha[i].destination;
    delete saha[i].destination_id;
    delete saha[i].first_weight;
    delete saha[i].second_time;
    delete saha[i].second_weight;
    delete saha[i].time_diff;
    delete saha[i].updated_at;
    delete saha[i].vehicle_plaque;
    delete saha[i].weighbridge;
    delete saha[i].weighbridge_id;
    delete saha[i].weight_id;
    saha[i].tonnage = Number((saha[i].weight_diff / 1000).toFixed(0));
    delete saha[i].weight_diff;
    let firstDate = saha[i].weight_at + " " + saha[i].first_time;
    let dateObj = new Date(saha[i].weight_at + " " + saha[i].first_time);
    dateObj.setMinutes(dateObj.getMinutes() + 10);
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var updatedTime23HourFormat =
      (hours < 10 ? "0" : "") +
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes;

    // Combine the original date with the updated time in the original format
    var updatedDateTimeString = firstDate.replace(
      /\d{2}:\d{2}:\d{2}$/,
      updatedTime23HourFormat,
    );
    const date = updatedDateTimeString + ":00";
    saha[i].unloading_exit_at = date;
    saha[i].block_name = "D-saha";
    saha[i].load_name = "CF2";
    delete saha[i].first_time;
    delete saha[i].weight_at;
  }

  const end_time = Number(end_at.split(" ")[1].split(":")[0]);
  if (end_time < 7) {
    last_day = last_day.addDays(-1);
    const originalDate = new Date(last_day);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const day = String(originalDate.getDate()).padStart(2, "0");
    last_day = `${year}-${month}-${day}`;
  } else {
    last_day = end_at.split(" ")[0];
  }
  // get one day before pile start
  let prev = first_day_for_prev_day.addDays(-1);
  const originalPrevDate = new Date(prev);
  const year_prev = originalPrevDate.getFullYear();
  const month_Prev = String(originalPrevDate.getMonth() + 1).padStart(2, "0");
  const day_Prev = String(originalPrevDate.getDate()).padStart(2, "0");
  const convertedDateString_prev = `${year_prev}-${month_Prev}-${day_Prev}`;

  for (let i = 0; i < 100; i++) {
    let next = first_day.addDays(i);
    const originalDate = new Date(next);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const day = String(originalDate.getDate()).padStart(2, "0");
    const convertedDateString = `${year}-${month}-${day}`;
    workdays.push(convertedDateString);
    if (convertedDateString == last_day) {
      break;
    }
    first_day = new Date(start_at);
  }
  workdays.unshift(convertedDateString_prev);

  // fetch all service in workdays
  const services = [];
  for (let i = 0; i < workdays.length; i++) {
    const { data } = await axios.post("/report/services", {
      report_at: workdays[i],
    });
    const mojtama = data.mojtama_service;
    const asfalt = data.asfalt_service;
    services.push(...asfalt.data, ...mojtama.data);
  }
  // return
  //remove extra prop
  for (let i = 0; i < services.length; i++) {
    delete services[i].id;
    delete services[i].group_id;
    delete services[i].shovel_exit_at;
    delete services[i].avg_speed_go;
    delete services[i].avg_speed_return;
    delete services[i].block_id;
    delete services[i].body;
    delete services[i].cycle_distance;
    delete services[i].cycle_time;
    delete services[i].driver_id;
    delete services[i].driver_name;
    delete services[i].load_id;
    delete services[i].loading_time;
    delete services[i].operator_id;
    delete services[i].operator_name;
    delete services[i].shift;
    delete services[i].shovel_back;
    delete services[i].shovel_id;
    delete services[i].shovel_meta;
    delete services[i].shovel_name;
    delete services[i].status;
    delete services[i].truck_id;
    delete services[i].truck_name;
    delete services[i].unloading_id;
    delete services[i].unloading_name;
    delete services[i].user_status;
    delete services[i].uuid;
    delete services[i].workday;
    services[i].tonnage = Number(services[i].tonnage);
  }
  let sub_rows;
  const all_sub_rows = [];
  const { data: subrow } = await axios.post("/report/sub-rows", { pile });
  const all_rows = subrow.data;
  for (let item in all_rows) {
    const rows = all_rows[item];
    for (let elem in rows) {
      sub_rows = rows[elem];
      for (const el of sub_rows) {
        delete el.fe;
        delete el.fe_status;
        delete el.feo;
        delete el.feo_status;
        delete el.locations;
        delete el.m;
        delete el.m_status;
        delete el.r;
        delete el.s;
        delete el.p;
        delete el.p_status;
        delete el.r_status;
        el.d = Number(el.d);
        all_sub_rows.push(el);
      }
    }
  }
  const mine_saha_service = [...saha, ...services];

  const sortedService = mine_saha_service.sort(comporer_unloading_exit);
  const sorted_sub_rows = all_sub_rows.sort(comporer_sampling);

  const positionOfFirstSample = Number(sorted_sub_rows[0].d);
  if (positionOfFirstSample < 400) {
    sorted_sub_rows.unshift({
      row: 1,
      piling_code: "CR 1-1-1",
      sampling_at: start_at,
      d: 60,
      sub_row: "1",
    });
  } else {
    sorted_sub_rows.unshift({
      row: 1,
      piling_code: "CR 1-1-1",
      sampling_at: start_at,
      d: 600,
      sub_row: "1",
    });
  }

  const intervals = {};
  // interals contain services between samples
  for (let i = 0; i < sorted_sub_rows.length; i++) {
    if (sorted_sub_rows[i + 1]) {
      intervals[`${i}-${i + 1}`] = {
        piling_code: sorted_sub_rows[i + 1].piling_code,
        row: sorted_sub_rows[i + 1].row,
        sub_row: sorted_sub_rows[i + 1].sub_row,
        d1: sorted_sub_rows[i].d,
        d2: sorted_sub_rows[i + 1].d,
        time1: sorted_sub_rows[i].sampling_at,
        time2: sorted_sub_rows[i + 1].sampling_at,
        services: [],
      };
    }
  }

  for (let i = 0; i < sortedService.length; i++) {
    for (const item in intervals) {
      const serviceTime = new Date(sortedService[i].unloading_exit_at);
      const time1 = new Date(intervals[item].time1);
      const time2 = new Date(intervals[item].time2);
      if (serviceTime > time1 && serviceTime < time2) {
        intervals[item].services.push(sortedService[i]);
      }
    }
  }

  const intervalsArray = [];
  for (const item in intervals) {
    intervalsArray.push(intervals[item]);
  }

  for (let i = 0; i < intervalsArray.length; i++) {
    const d2 = intervalsArray[i].d2;
    const d1 = intervalsArray[i].d1;
    const row = intervalsArray[i].row;
    const sub_row = intervalsArray[i].sub_row;
    let direction = "go";
    let changeRow = false;
    if (d2 - d1 < 0) {
      direction = "return";
    }
    let distance;
    if (i == 0) {
      distance = Math.abs(d2 - d1);
    } else {
      if (
        row != intervalsArray[i - 1].row ||
        sub_row != intervalsArray[i - 1].sub_row
      ) {
        changeRow = true;
        if (intervalsArray[i].d1 > 350) {
          distance = 1200 - intervalsArray[i].d2 - intervalsArray[i].d1;
        } else {
          distance = d2 + d1 - 120;
        }
      } else {
        distance = Math.abs(d2 - d1);
      }
    }

    const numberOfServiceInDistance = intervalsArray[i].services.length;
    const serviceInterval = distance / numberOfServiceInDistance;
    const services = intervalsArray[i].services;
    let counter = 1;
    for (let elem of services) {
      if (changeRow) {
        if (d1 + counter * serviceInterval > 600) {
          elem.position = 1200 - (d1 + counter * serviceInterval);
        } else if (d1 - counter * serviceInterval < 60) {
          elem.position = 120 - (d1 - counter * serviceInterval);
        } else {
          if (d1 < 320) {
            elem.position = d1 - counter * serviceInterval;
          }
          if (d1 >= 320) {
            elem.position = d1 + counter * serviceInterval;
          }
        }
      } else {
        if (direction == "go") {
          elem.position = d1 + counter * serviceInterval;
        } else {
          elem.position = d1 - counter * serviceInterval;
        }
      }
      counter++;
    }
  }

  let locations = "";
  let counter = 1;
  for (const item of intervalsArray) {
    const piling_code = item.piling_code;
    const start = item.time1;
    const end = item.time2;
    const from = item.d1;
    const to = item.d2;
    const all_services = item.services;
    for (const elem of all_services) {
      const block_name = elem.block_name;
      const load_name = elem.load_name;
      const unloading_exit_at = elem.unloading_exit_at;
      const loc = Number(elem.position).toFixed(1);
      locations += `
    <tr>
    <td data-t="n" data-a-h="center">${counter}</td>
    <td data-a-h="center">${piling_code}</td>
    <td data-a-h="center">${block_name}</td>
    <td data-a-h="center">${load_name}</td>
    <td data-a-h="center">${unloading_exit_at}</td>
    <td data-a-h="center" data-t="n">${loc}</td>
    </td>
    `;
      counter++;
    }
  }
  service_location.innerHTML = locations;

  const finalArrayOfSubrows = [];

  for (const item of intervalsArray) {
    let services = item.services;
    for (const elem of services) {
      finalArrayOfSubrows.push({
        position: elem.position,
        load_name: elem.load_name,
        block_name: elem.block_name,
        exit_at: elem.unloading_exit_at,
        tonnage: elem.tonnage,
      });
    }
  }
  const divided = {};
  // devided is devide all service between 60-80 , 80-100 , ....
  for (let i = 60; i < 600; i += 20) {
    if (i + 21) {
      divided[`${i}-${i + 20}`] = [];
    }
  }

  for (const item in divided) {
    const min = Number(item.split("-")[0]);
    const max = Number(item.split("-")[1]);
    for (let i = 0; i < finalArrayOfSubrows.length; i++) {
      if (
        Number(finalArrayOfSubrows[i].position) > min &&
        Number(finalArrayOfSubrows[i].position) < max
      ) {
        divided[item].push(finalArrayOfSubrows[i]);
      }
    }
  }
  const numberInSections = {};
  const numberInSections_CF2 = {};
  const numberInSections_CF3 = {};
  const numberInSections_OXIDE = {};
  const tonnageInSections = {};
  const tonnageInSections_CF2 = {};
  const tonnageInSections_CF3 = {};
  const tonnageInSections_OXIDE = {};
  const blocks = [...mine_blocks, "D-saha"];
  for (const block of blocks) {
    if (block.includes("Ton")) {
      continue;
    }
    numberInSections[block] = {};
    numberInSections_CF2[block] = {};
    numberInSections_CF3[block] = {};
    numberInSections_OXIDE[block] = {};

    tonnageInSections[block] = {};
    tonnageInSections_CF2[block] = {};
    tonnageInSections_CF3[block] = {};
    tonnageInSections_OXIDE[block] = {};
  }

  for (const item in numberInSections) {
    for (let i = 60; i < 600; i += 20) {
      if (i + 21) {
        numberInSections[item][`${i}-${i + 20}`] = 0;
        numberInSections_CF2[item][`${i}-${i + 20}`] = 0;
        numberInSections_CF3[item][`${i}-${i + 20}`] = 0;
        numberInSections_OXIDE[item][`${i}-${i + 20}`] = 0;

        tonnageInSections[item][`${i}-${i + 20}`] = 0;
        tonnageInSections_CF2[item][`${i}-${i + 20}`] = 0;
        tonnageInSections_CF3[item][`${i}-${i + 20}`] = 0;
        tonnageInSections_OXIDE[item][`${i}-${i + 20}`] = 0;
      }
    }
  }

  for (const block in numberInSections) {
    for (let interval in numberInSections[block]) {
      // interval =60-80 , ...
      for (const inervalInDivided in divided) {
        // inervalInDivided = 60-80 , ...
        if (inervalInDivided == interval) {
          for (const service of divided[inervalInDivided]) {
            if (service.block_name == block) {
              numberInSections[block][interval]++;
              tonnageInSections[block][interval] += service.tonnage;
              if (service.load_name == "CF2") {
                numberInSections_CF2[block][interval]++;
                tonnageInSections_CF2[block][interval] += service.tonnage;
              } else if (service.load_name == "CF3") {
                numberInSections_CF3[block][interval]++;
                tonnageInSections_CF3[block][interval] += service.tonnage;
              } else if (service.load_name == "اکسید") {
                numberInSections_OXIDE[block][interval]++;
                tonnageInSections_OXIDE[block][interval] += service.tonnage;
              }
            }
          }
        }
      }
    }
  }

  for (let item in numberInSections) {
    if (!item.includes("D-")) {
      continue;
    }
    tbody.innerHTML += `<tr>
        <td>${item}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["60-80"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["80-100"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["100-120"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["120-140"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["140-160"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["160-180"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["180-200"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["200-220"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["220-240"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["240-260"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["260-280"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["280-300"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["300-320"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["320-340"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["340-360"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["360-380"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["380-400"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["400-420"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["420-440"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["440-460"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["460-480"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["480-500"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["500-520"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["520-540"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["540-560"]}</div>
        <td data-a-h="center" data-t="n">${numberInSections[item]["560-580"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections[item]["580-600"]}</td>
        </tr>`;
        tbody_tonnage.innerHTML += `<tr>
        <td>${item}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["60-80"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["80-100"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["100-120"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["120-140"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["140-160"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["160-180"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["180-200"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["200-220"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["220-240"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["240-260"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["260-280"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["280-300"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["300-320"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["320-340"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["340-360"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["360-380"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["380-400"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["400-420"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["420-440"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["440-460"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["460-480"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["480-500"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["500-520"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["520-540"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["540-560"]}</div>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["560-580"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections[item]["580-600"]}</td>
        </tr>`;
  }
  for (let item in numberInSections_CF2) {
    if (item.includes("D-")) {
      continue;
    }
    tbody.innerHTML += `<tr>
        <td>${item}-CF2</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["60-80"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["80-100"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["100-120"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["120-140"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["140-160"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["160-180"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["180-200"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["200-220"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["220-240"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["240-260"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["260-280"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["280-300"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["300-320"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["320-340"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["340-360"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["360-380"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["380-400"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["400-420"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["420-440"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["440-460"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["460-480"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["480-500"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["500-520"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["520-540"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["540-560"]}</div>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["560-580"]}</td>
        <td data-a-h="center" data-t="n">${numberInSections_CF2[item]["580-600"]}</td>
        </tr>`;
        tbody_tonnage.innerHTML += `<tr>
        <td>${item}-CF2</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["60-80"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["80-100"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["100-120"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["120-140"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["140-160"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["160-180"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["180-200"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["200-220"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["220-240"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["240-260"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["260-280"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["280-300"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["300-320"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["320-340"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["340-360"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["360-380"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["380-400"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["400-420"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["420-440"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["440-460"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["460-480"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["480-500"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["500-520"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["520-540"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["540-560"]}</div>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["560-580"]}</td>
        <td data-a-h="center" data-t="n">${tonnageInSections_CF2[item]["580-600"]}</td>
        </tr>`;
  }
  for (let item in numberInSections_CF3) {
    if (item.includes("D-")) {
      continue;
    }
    tbody_tonnage.innerHTML += `<tr>
  <td>${item}-CF3</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["60-80"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["80-100"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["100-120"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["120-140"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["140-160"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["160-180"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["180-200"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["200-220"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["220-240"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["240-260"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["260-280"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["280-300"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["300-320"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["320-340"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["340-360"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["360-380"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["380-400"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["400-420"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["420-440"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["440-460"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["460-480"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["480-500"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["500-520"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["520-540"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["540-560"]}</div>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["560-580"]}</td>
  <td data-a-h="center" data-t="n">${tonnageInSections_CF3[item]["580-600"]}</td>
  </tr>`;
    tbody.innerHTML += `<tr>
  <td>${item}-CF3</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["60-80"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["80-100"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["100-120"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["120-140"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["140-160"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["160-180"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["180-200"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["200-220"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["220-240"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["240-260"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["260-280"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["280-300"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["300-320"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["320-340"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["340-360"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["360-380"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["380-400"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["400-420"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["420-440"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["440-460"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["460-480"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["480-500"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["500-520"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["520-540"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["540-560"]}</div>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["560-580"]}</td>
  <td data-a-h="center" data-t="n">${numberInSections_CF3[item]["580-600"]}</td>
  </tr>`;
  }

  search_btn.disabled = false;
  search_btn.classList.remove("d-none");
  loading_btn.classList.add("d-none");
});

// 700=>1   742=> 3   Beh=> 6   Apa=>7

function comporer_unloading_exit(a, b) {
  if (a.unloading_exit_at > b.unloading_exit_at) {
    return 1;
  } else {
    return -1;
  }
}
function comporer_sampling(a, b) {
  if (a.sampling_at > b.sampling_at) {
    return 1;
  } else {
    return -1;
  }
}
