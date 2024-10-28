import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/images/pbslogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faTrash,
  faEraser,
  faCalculator,
  faMagnifyingGlass,
  faCopy,
  faFilePdf,
  faPrint,
  faPause,
  faCircleQuestion,
  faCircleInfo,
  faTriangleExclamation,
  faArrowTurnDown,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faArrowRotateRight,
  faArrowRotateLeft,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCircle,
  faCircleCheck,
  faRectangleXmark,
  faComment,
} from '@fortawesome/free-regular-svg-icons';

export default async function Global() {
  return (
    <main>
      <header className="pageHeader">
        <Link href="/" className="button pageHeaderLeft">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h1>Heading 1</h1>
        <div className="pageHeaderRight">
          <div className="avatarBox">
            <div className="avatar">
              <Image alt="PBS Buildings Logo" src={logo} />
            </div>
            <p>username</p>
          </div>
        </div>
      </header>
      <div style={{ margin: '1vw' }}>
        <h2>Heading 2</h2>
        <br />
        <section className="card">
          <header className="cardHeader">
            <h3>Button Styles</h3>
          </header>
          <div
            className="cardBox"
            style={{ display: 'flex', 'flex-flow': 'wrap', gap: '.5em' }}
          >
            <button className="prim">Primary</button>
            <button className="sec">Secondary</button>
            <button className="accent">Accent</button>
            <button className="success">Success</button>
            <button className="reject">Reject</button>
            <button className="nuetral">Nuetral</button>
          </div>
          <div className="divider"></div>
          <div
            className="cardBox"
            style={{ display: 'flex', 'flex-flow': 'wrap', gap: '.5em' }}
          >
            <button
              type="button"
              className="addButton"
              style={{ margin: 'auto' }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </section>
        <br />
        <section className="card">
          <header className="cardHeader">
            <h3>Icon Buttons</h3>
          </header>
          <div
            className="cardBox"
            style={{ display: 'flex', flexFlow: 'wrap', gap: '.5em' }}
          >
            <button className="icon reject">
              <FontAwesomeIcon icon={faEraser} />
            </button>
            <button className="icon prim">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            <button className="icon prim">
              <FontAwesomeIcon icon={faCalculator} />
            </button>
            <button className="icon reject">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <br />
          <div
            className="cardBox"
            style={{
              display: 'flex',
              flexFlow: 'wrap',
              gap: '.5em',
              marginTop: '.5em',
            }}
          >
            <button className="icon actionButton reject">
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className="icon actionButton sec">
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <button className="icon actionButton success">
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
            <button className="icon actionButton accent">
              <FontAwesomeIcon icon={faPause} />
            </button>
          </div>
          <div
            className="cardBox"
            style={{
              display: 'flex',
              flexFlow: 'wrap',
              gap: '.5em',
              marginTop: '.5em',
              backgroundColor: 'var(--dark-blue)',
              borderRadius: '0 0 .5em .5em',
            }}
          >
            <div
              className="center"
              style={{ width: '32px', height: '32px', alignContent: 'center' }}
            >
              <FontAwesomeIcon icon={faCircle} color="var(--red)" />
            </div>
            <div
              className="center"
              style={{ width: '32px', height: '32px', alignContent: 'center' }}
            >
              <FontAwesomeIcon icon={faCircleCheck} color="var(--yellow)" />
            </div>
            <div
              className="center"
              style={{ width: '32px', height: '32px', alignContent: 'center' }}
            >
              <FontAwesomeIcon icon={faCircleCheck} color="var(--green)" />
            </div>
            <div
              className="center"
              style={{ width: '32px', height: '32px', alignContent: 'center' }}
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                color="var(--yellow)"
              />
            </div>
            <div
              className="center"
              style={{ width: '32px', height: '32px', alignContent: 'center' }}
            >
              <FontAwesomeIcon icon={faCircleInfo} color="var(--blue)" />
            </div>
            <div
              className="center"
              style={{ width: '32px', height: '32px', alignContent: 'center' }}
            >
              <FontAwesomeIcon icon={faRectangleXmark} color="var(--red)" />
            </div>
            <div
              className="center"
              style={{ width: '32px', height: '32px', alignContent: 'center' }}
            >
              <FontAwesomeIcon icon={faComment} color="var(--yellow)" />
            </div>
          </div>
        </section>
        <br />
        <section className="card">
          <header className="cardHeader">
            <h3>Slider Buttons</h3>
          </header>
          <div className="cardInput">
            <div className="sliderGrid">
              <button className="sliderLeftButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <div className="cardInput">
                <input
                  type="text"
                  id="slider1"
                  name="slider1"
                  placeholder="leftRight"
                />
              </div>
              <button className="sliderRightButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
          <div className="cardInput">
            <div className="sliderGrid">
              <button className="sliderLeftButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
              <div className="cardInput">
                <input
                  type="text"
                  id="slider2"
                  name="slider2"
                  placeholder="upDown"
                />
              </div>
              <button className="sliderRightButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
            </div>
          </div>
          <div className="cardInput">
            <div className="sliderGrid">
              <button className="sliderLeftButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faArrowRotateRight} />
              </button>
              <div className="cardInput">
                <input
                  type="text"
                  id="slider3"
                  name="slider3"
                  placeholder="rotation"
                />
              </div>
              <button className="sliderRightButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
              </button>
            </div>
          </div>
          <div className="cardInput">
            <div className="sliderGrid">
              <button className="sliderLeftButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <div className="cardInput">
                <input
                  type="text"
                  id="slider4"
                  name="slider4"
                  placeholder="number"
                />
              </div>
              <button className="sliderRightButton" type="button" tabIndex="-1">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </section>
      </div>
      <div style={{ margin: '1vw 1vw 1vw 0' }}>
        <section className="card">
          <header className="cardHeader">
            <h3>Heading 3</h3>
          </header>
          <div className="cardBox">
            <h4>Heading 4</h4>
            <br />
            <h5>Heading 5</h5>
            <h4 style={{ position: 'relative', color: 'var(--light-gray)' }}>
              <small
                style={{
                  position: 'absolute',
                  top: '10px',
                  transform: 'scaleX(-1)',
                }}
              >
                <FontAwesomeIcon icon={faArrowTurnDown} />
              </small>
              &nbsp; &nbsp; divider&nbsp;
              <small style={{ position: 'absolute', top: '10px' }}>
                <FontAwesomeIcon icon={faArrowTurnDown} />
              </small>
              &nbsp; &nbsp;
            </h4>
            <div className="divider"></div>
            <br />
            <div className="grid4">
              <div className="grid" style={{ height: '86px' }}>
                <h5 className="center">cardInput</h5>
                <div className="cardInput">
                  <label htmlFor="testInput">Label:</label>
                  <input id="testInput" type="text"></input>
                </div>
              </div>
              <div className="grid" style={{ height: '86px' }}>
                <h5 className="center">cardInput row</h5>
                <div>&nbsp;</div>
                <div className="cardInput row">
                  <label htmlFor="testInput">Label</label>
                  <input id="testInput" type="text"></input>
                </div>
              </div>
              <div className="grid" style={{ height: '86px' }}>
                <h5 className="center">radioGroup</h5>
                <fieldset className="radioGroup center">
                  <div>
                    <input type="radio" id="radio1" name="test" />
                    <label htmlFor="radio1">Label</label>
                  </div>
                  <div>
                    <input type="radio" id="radio2" name="test" />
                    <label htmlFor="radio2">Label</label>
                  </div>
                </fieldset>
              </div>
              <div className="grid" style={{ height: '86px' }}>
                <h5 className="center">checkboxGroup</h5>
                <div className="checkboxGroup center">
                  <div className="checkRow">
                    <input type="checkbox" id="check1" name="check1" />
                    <label htmlFor="check1">Label</label>
                  </div>
                  <div className="checkRow">
                    <input type="checkbox" id="check2" name="check2" />
                    <label htmlFor="check2">Label</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="card" style={{ marginTop: '1vw' }}>
          <div className="cardBox">
            <header className="cardHeader">
              <h3>Grid Layouts</h3>
            </header>
            <div className="grid">
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid"></input>
              </div>
            </div>
            <div className="grid2">
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid2"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid2"></input>
              </div>
            </div>
            <div className="grid3">
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid3"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid3"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid3"></input>
              </div>
            </div>
            <div className="grid4">
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid4"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid4"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid4"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid4"></input>
              </div>
            </div>
            <div className="grid6">
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid6"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid6"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid6"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid6"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid6"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid6"></input>
              </div>
            </div>
            <div className="grid8">
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
              <div className="cardInput">
                <input id="testInput" type="text" placeholder="grid8"></input>
              </div>
            </div>
            <br />
            <div className="divider"></div>
            <br />
            <div className="tableGrid5">
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid5"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid5"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid5"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid5"
                ></input>
              </div>
              <button type="button" className="icon reject deleteRow">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="tableGrid6">
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid6"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid6"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid6"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid6"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid6"
                ></input>
              </div>
              <button type="button" className="icon reject deleteRow">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="tableGrid7">
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid7"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid7"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid7"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid7"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid7"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid7"
                ></input>
              </div>
              <button type="button" className="icon reject deleteRow">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="tableGrid8">
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid8"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid8"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid8"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid8"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid8"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid8"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid8"
                ></input>
              </div>
              <button type="button" className="icon reject deleteRow">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="tableGrid9">
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid9"
                ></input>
              </div>
              <button type="button" className="icon reject deleteRow">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="tableGrid10">
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <div className="cardInput">
                <input
                  id="testInput"
                  type="text"
                  placeholder="tableGrid10"
                ></input>
              </div>
              <button type="button" className="icon reject deleteRow">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
