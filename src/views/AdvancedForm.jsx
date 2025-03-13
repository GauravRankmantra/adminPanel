import { Fragment } from "react";
import { Col, Row, Button } from "react-bootstrap";
import Card from "@/components/Card/Card";
import { CardBody } from "react-bootstrap";

const AdvancedForm = () => {
  return (
    <Fragment>
      <Row className="gy-4 gx-4 justify-content-center">
        <Col lg={6} md={8} sm={12}>
          <Card title="Update Song">
            <CardBody>
              <div className="overflow-hidden">
                <form>
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          className="d-block mb-1 form-control-label"
                          htmlFor="coverImage"
                        >
                          Cover Image
                        </label>
                      </Col>
                      <Col md={9}>
                        <div className="form-group">
                          <input
                            type="file"
                            className="form-control-file"
                            id="coverImage"
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Song Name */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          htmlFor="text"
                          className="form-control-label mb-1"
                        >
                          Song name
                        </label>
                      </Col>
                      <Col md={9}>
                        <input
                          id="text"
                          type="text"
                          className="form-control"
                          placeholder="Enter the update song name.."
                          required
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Artist Name */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          htmlFor="text"
                          className="form-control-label mb-1"
                        >
                          Artist name
                        </label>
                      </Col>
                      <Col md={9}>
                        <input
                          id="text"
                          type="text"
                          className="form-control"
                          placeholder="Enter the update artist name.."
                          required
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Select Size */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          htmlFor="small"
                          className="form-control-label mb-1"
                        >
                          Select Size
                        </label>
                      </Col>
                      <Col md={9}>
                        <select
                          id="small"
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                        >
                          <option>Please select</option>
                          <option defaultValue="1">KB</option>
                          <option defaultValue="2">MB</option>
                          <option defaultValue="3">GB</option>
                        </select>
                      </Col>
                    </Row>
                  </div>

                  {/* Quality Radios */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label className="form-control-label mb-1">
                          Quality
                        </label>
                      </Col>
                      <Col md={9}>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioInline2"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioInline2"
                          >
                            HIGH
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioInline3"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioInline3"
                          >
                            LOW
                          </label>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          className="d-block mb-1 form-control-label"
                          htmlFor="fileInput"
                        >
                          File input
                        </label>
                      </Col>
                      <Col md={9}>
                        <div className="form-group">
                          <input
                            type="file"
                            className="form-control-file"
                            id="fileInput"
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="form-group mt-4 text-center w-100">
                    <Button type="submit" className="w-100">
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AdvancedForm;
