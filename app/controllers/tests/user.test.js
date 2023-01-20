jest.useFakeTimers();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "../../../router";

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mockRequest, mockResponse } from "jest-mock-req-res";

import { getSchools } from "../school";
// import express from "express";

import { getSchoolService, getSchoolDetailService, getSchoolSearchFiltersService } from "../../service/school.js";
import { mockSchoolResult } from "../../../utils/testMockData";

import request from "supertest";
import { before } from "lodash";
import app, { server } from '../../../server'; 
const Sequelize = require("sequelize");

jest.mock("../../service/school.js");

// const app = express();

const baseURL = "http://localhost:" + process.env.PORT;

// var server;

let sequelize;

function prepare(sequelize) {
  return new Promise((res) => {
    sequelize.beforeConnect((config) => res(config));
  });
}

describe("School", () => {
  beforeEach(() => {
    // app.use(bodyParser.urlencoded({ extended: false }));

    // app.use(express.json());
    // app.use(
    //   cors({
    //     allowedHeaders: ["sessionid", "content-type", "x-jwt-token"],
    //     exposedHeaders: ["sessionid"],
    //     origin: "*",
    //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //     preflightContinue: false,
    //   })
    // );

    // app.use("/api", router);

    // server = app.listen(process.env.PORT);

    // const DB_HOST = "127.0.0.1";
    // const DB_DATABASE = "admissionpedia_temp";
    // const DB_USERNAME = "root";
    // const DB_PASSWORD = "root";

    // jest.useFakeTimers();

    // sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    //   dialect: 'mysql',
    //   host: DB_HOST
    // });

    // setTimeout(() => {
    //     sequelize
    //     .sync()
    //     .then(() => {

    //       // task.start();
    //       console.log(">>>connected with db ")
    //       // migrateDB();
    //     })
    // },10)
  });

  afterEach(() => {
    server && server.close();
  });

  describe("User Registration", () => {
    test.only("Fail: School search if name is not passed", async () => {
      const res = await request(server).get("/api/user/registration");
      const errorMessage = JSON.parse(res.error.text);
      expect(res.status).toBe(400);
      expect(errorMessage.err).toBe("name is required");
      expect(errorMessage.success).toBe(false);
    });

    test("Fail: School search if board filter is not number (db id)", async () => {
      const res = await request(app).get(
        "/api/school?keyword=Prabhat Academy&board=ab"
      );
      const errorMessage = JSON.parse(res.error.text);
      expect(res.status).toBe(400);
      expect(errorMessage.err).toBe("board must be a number");
      expect(errorMessage.success).toBe(false);
    });

    test("Fail: School search if gender filter is not correct", async () => {
      const res = await request(app).get(
        "/api/school?keyword=Prabhat Academy&board=1&gender=good"
      );
      const errorMessage = JSON.parse(res.error.text);
      expect(res.status).toBe(400);
      expect(errorMessage.err).toBe(
        "gender must be one of [Male, Female, Co-ed]"
      );
      expect(errorMessage.success).toBe(false);
    });

    test("Fail: School search if district filter is not number (id) ", async () => {
      const res = await request(app).get(
        "/api/school?keyword=Prabhat Academy&board=1&gender=Female&district=true"
      );
      const errorMessage = JSON.parse(res.error.text);
      expect(res.status).toBe(400);
      expect(errorMessage.err).toBe("district must be a number");
      expect(errorMessage.success).toBe(false);
    });

    test("Fail: School search if class filter is not number (id) ", async () => {
      const res = await request(app).get(
        "/api/school?keyword=Prabhat Academy&board=1&gender=Female&district=1&class=true"
      );
      const errorMessage = JSON.parse(res.error.text);
      expect(res.status).toBe(400);
      expect(errorMessage.err).toBe("class must be a number");
      expect(errorMessage.success).toBe(false);
    });

    test("Fail: School search if residencyType filter is not correct ", async () => {
      const res = await request(app).get(
        "/api/school?keyword=Prabhat Academy&board=1&gender=Female&district=1&class=1&residencyType=true"
      );
      const errorMessage = JSON.parse(res.error.text);
      expect(res.status).toBe(400);
      expect(errorMessage.err).toBe(
        "residencyType must be one of [Day And Boarding, Day, Boarding]"
      );
      expect(errorMessage.success).toBe(false);
    });

    test("Fail: School search if db connection is failed", async () => {
      const mockSchoolService = getSchoolService;

      mockSchoolService.mockImplementation(
        () => new Promise((resolve, reject) => reject("Something went wrong"))
      );

      const res = await request(app).get("/api/school?keyword=Prabhat Academy");
      expect(res.status).toBe(500);
      expect(res.error.text).toBe("Something went wrong");
    });

    test("Pass: School search ", async () => {
      const mockSchoolService = getSchoolService;

      mockSchoolService.mockImplementation(
        () => new Promise((resolve, reject) => resolve(mockSchoolResult))
      );

      const res = await request(app).get("/api/school?keyword=Prabhat Academy");

      expect(res.status).toBe(200);
      expect(res.text).toBe(JSON.stringify(mockSchoolResult));
    });
  });

  describe.skip("school detail", () => {
    test("Fail: School Detail  if school id not passed", async () => {

      const mockSchoolAPI = getSchoolDetailService;
      mockSchoolAPI.mockClear()

      const res = await request(app).get("/api/school/detail/null");

      expect(res.status).toBe(400);
      expect(res.error.text).toBe("School Id is not passed");
    });

    test("Fail: School Detail if db connection is failed", async () => {
      const mockSchoolService = getSchoolDetailService;
      
      mockSchoolService.mockImplementation(
        () => new Promise((resolve, reject) => reject("Something went wrong"))
      );

      const res = await request(app).get("/api/school/detail/abc");
      expect(res.status).toBe(500);
      expect(res.error.text).toBe("Something went wrong");
    });

    
    test("Pass: School Detail", async () => {
      const mockSchoolService = getSchoolDetailService;
      
      mockSchoolService.mockImplementation(
        () => new Promise((resolve, reject) => resolve(mockSchoolResult[0]))
      );

      const res = await request(app).get("/api/school/detail/abc");
      expect(res.status).toBe(200);
      expect(res.text).toBe(JSON.stringify(mockSchoolResult[0]));
    });
  });

  describe.skip("search filters ", () => {

    test("Fail: School Search Filter if db connection is failed", async () => {
      const mockSchoolService = getSchoolSearchFiltersService;
      
      mockSchoolService.mockImplementation(
        () => new Promise((resolve, reject) => reject("Something went wrong"))
      );

      const res = await request(app).get("/api/school/search-filters");
      expect(res.status).toBe(500);
      expect(res.error.text).toBe("Something went wrong");
    });

    
    test("Pass: School Detail", async () => {
      const mockSchoolService = getSchoolSearchFiltersService;
      
      mockSchoolService.mockImplementation(
        () => new Promise((resolve, reject) => resolve({}))
      );

      const res = await request(app).get("/api/school/search-filters");
      expect(res.status).toBe(200);
    });
  });
});
