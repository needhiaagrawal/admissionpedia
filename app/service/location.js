import District from "../models/district";
import State from "../models/state";
import Country from '../models/country';

import { Op } from "sequelize";
import { getSchoolService } from "./school";

export const getSchoolLocationsService = async (searchTerm, limit) => {
  const districtRows = await District.findAll({
    where: {
      name: {
        [Op.startsWith]:  '%'+ searchTerm +'%'
      }
    },
    limit,
    include: [{
      model: State,
      as: 'state',
      include: { model: Country, as: 'country'},
      raw: false
    }]
  })


  const formattedDistrictRows = districtRows.map((districtRow) => {
    const districtData = districtRow.toJSON();
    return {
        "type": "location",
        "district_name": districtData.name,
        "state_id": districtData["state_id"],
        "state_name": districtData.state.name,
        "country_id": districtData.state["country_id"],
        "country_name": districtData.state.country.name,
        "iso_code": districtData.state.country["iso_code"]
    };
  })


  let schoolRows = []
  if (formattedDistrictRows.length < 10) {
    schoolRows = await getSchoolService(searchTerm, null, null, null, null, null, null, 10 - formattedDistrictRows.length);
    schoolRows = schoolRows.map((schoolRow) => ({ type: "school", ...schoolRow }));
  }
  return [...formattedDistrictRows, ...schoolRows];
}