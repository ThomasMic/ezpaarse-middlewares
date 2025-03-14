'use strict';

const { contextify } = require('../mock');
const mw = require('.');
const { expect } = require('chai');

const ecs = [
  { ip: '95.138.124.9' }, // simple ip
  { ip: '140.77.15.50' }, // in range ip
  { login: '95.138.124.9' }, // simple ip
];


describe('ip-to-abesid', () => {
  it('ip: Should enrich with "abes-id"', async () => {
    const process = await contextify(mw);
    const ec = ecs[0];
    process(ec, () => {});
    expect(ec).to.have.property('abes-id', 'ABES5SYHNO3YL');
  });

  // range: 140.77.168-255.0-255, 140.77.0-50.0-255, 140.77.52-165.0-255
  it('range ip: Should enrich with "abes-id"', async () => {
    const process = await contextify(mw);
    const ec = ecs[1];
    process(ec, () => {});
    expect(ec).to.have.property('abes-id', 'ABES1DFEJD1V1');
  });

  it('range ip: Should enrich with "custom-id"', async () => {
    const process = await contextify(mw, (ctx) => {
      ctx.request.headers['ip-to-abesid-enriched-field'] = 'custom-id';
    });
    const ec = ecs[0];
    process(ec, () => {});
    expect(ec).to.have.property('custom-id', 'ABES5SYHNO3YL');
  });

  it('range ip: Should enrich with "custom-id" for custom source field "login"', async () => {
    const process = await contextify(mw, (ctx) => {
      ctx.request.headers['ip-to-abesid-source-field'] = 'login';
      ctx.request.headers['ip-to-abesid-enriched-field'] = 'custom-id';
    });
    const ec = ecs[2];
    process(ec, () => {});
    expect(ec).to.have.property('custom-id', 'ABES5SYHNO3YL');
  });
});
