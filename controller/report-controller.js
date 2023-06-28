
import { pile_info } from "../helper/pile-info.js";
import {service} from '../helper/service.js';
import { sub_row} from '../helper/sub-row.js';
import {saha_r} from '../helper/saha.js';
import {section_info} from '../helper/section-info.js';

export class Report {

  static async pile(req, res) {
    try {
      var token = process.env.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      var { pile } = req.body;
      var pileInfo = await pile_info(pile,config);
      return res.json(pileInfo);
    } catch (err) {
      res.json(false);
    }
  }
  static async services(req, res) {
    try {
      var token = process.env.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      var { report_at } = req.body;
      var mojtama_service = await service(report_at,[1],[],[1804,1805],config);
      var asfalt_service = await service(report_at,[3,6,7],[],[1804,1805],config);
      return res.json({asfalt_service,mojtama_service});
    } catch (err) {
      res.json(false);
    }
  }

  static async saha_cr(req, res) {
    try {
      var token = process.env.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      var { start_at,end_at} = req.body;
      var saha = await saha_r(start_at,end_at,config);
      return res.json(saha);
    } catch (err) {
      console.log(err);
      res.json(false);
    }
  }
  static async sub_rows(req, res) {
    try {
      var token = process.env.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      var { pile } = req.body;
      var sub = await sub_row(pile,config);
      return res.json(sub);
    } catch (err) {
      res.json(false);
    }
  }

  static async section_analysis (req,res){
    try {
      var token = process.env.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      var { pile } = req.body;
      var sub = await section_info(pile,config);
      return res.json(sub);
    } catch (err) {
      res.json(false);
    }
  }

}
