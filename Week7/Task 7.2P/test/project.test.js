const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../server"); 

chai.use(chaiHttp);

describe("GET /api/projects", function () {
  it("should return status 200", function (done) {
    chai
      .request("http://localhost:3000")
      .get("/api/projects")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });


  it("should return a JSON response", function (done) {
    chai
      .request("http://localhost:3000")
      .get("/api/projects")
      .end((err, res) => {
        expect(res).to.be.json;
        done();
      });
  });


  it("should return an array of projects", function (done) {
    chai
      .request("http://localhost:3000")
      .get("/api/projects")
      .end((err, res) => {
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("each project should have title, image, link, and description", function (done) {
    chai
      .request("http://localhost:3000")
      .get("/api/projects")
      .end((err, res) => {
        const project = res.body.data[0];
        expect(project).to.include.all.keys("title", "image", "link", "description");
        done();
      });
  });
});
