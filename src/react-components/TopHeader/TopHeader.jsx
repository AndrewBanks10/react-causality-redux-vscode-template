import React from 'react'
import styles from '../../stylesheets/TopHeader'
import img from '../../assets/react.png'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
const MuiTheme = getMuiTheme()

const TopHeader = () =>
  <div className={styles.topContainer}>
    <div className={styles.logoContainer}>
      <table>
        <tbody>
          <tr>
            <td className={styles.reactContainer}>
              <img className={styles.reactLogo} src={img} />
            </td>
            <td className={styles.topTextContainer} style={{ color: MuiTheme.appBar.textColor }}>
              <h1 className={styles.titleText}>React Development Environment Demo</h1>

              <span className={styles.descriptionText}>Simply install and you are coding and debugging immediately.</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>Supports MVC, basic babel es6, react, react-redux, react-router, react-causality-redux, material-ui components, vscode debugging, hot re-loading of css, business code and react components. For production builds, supports choice of
                    dll libraries or one minimized js bundle. Supports less, css, sass, scss with and without css modules.
                    Built in support for mocha/enzyme testing and vscode debugging for the testing and much more.
    </div>
  </div>
export default TopHeader
