import expect from 'expect';
import { createStore } from '../src/index';
import { connect, Connector, Provider } from '../src/react';
import React from 'react/addons';
import jsdom from 'jsdom';


const TestUtils = React.addons.TestUtils;
describe('full dispatch', () => {
	beforeEach(function() {
		global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
		global.window = document.parentWindow;
	});
	afterEach(function() {
		global.document = undefined;
		global.window = undefined;
	});
	it('sync dispatch', () => {
		const stores = {
			auth: (state = {}, action) => {

				if (action.type === 'authenticate') {

					return {name: action.name};

				}

				return state;

			}
		};

		const authenticate = (name) => ({
			type: 'authenticate',
			name: name
		});

		const redux = createStore(stores);

		class App {

			render() {

				return (
					<div>
						<h1>App</h1>
						<Provider store={redux}>
							{() => (
								<Auth />
							)}
						</Provider>
					</div>
				);

			}
		}

		@connect((state) => ({
			auth: state.auth
		}))
		class Auth extends React.Component {

			componentDidMount() {

				this.props.dispatch(authenticate('Bob'));

			}

			render() {

				if (this.props.auth.name) {

					return (
						<div id="success">
							{this.props.auth.name}
						</div>
					);

				}

				return <div>no auth</div>;

			}

		}
		React.render(React.createElement(App), document.body);

		expect(!!document.getElementById('success')).toBe(true);
	});
});

