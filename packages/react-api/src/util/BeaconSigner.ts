// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DAppClient } from '@airgap/beacon-sdk';

import { Signer } from '@polkadot/api/types';
import { SignerPayloadJSON, SignerPayloadRaw, SignerResult } from '@polkadot/types/types/extrinsic';

export class BeaconSigner implements Signer {
  private readonly client: DAppClient;

  constructor (client: DAppClient) {
    this.client = client;
  }

  async signPayload (_payload: SignerPayloadJSON): Promise<SignerResult> {
    // TODO: Implement signPayload

    // Fix linter error
    await new Promise(() => undefined);

    return {
      id: 0,
      signature: '0x'
    };
  }

  async signRaw (raw: SignerPayloadRaw): Promise<SignerResult> {
    const signature = await this.client.requestSignPayload({
      payload: raw.data
    });

    return {
      id: 0,
      signature: signature.signature as any
    };
  }
}

export const client = new DAppClient({
  appUrl: 'https://airgap-it.github.io/beacon-polkadot-example-dapp/',
  iconUrl:
    'https://www.walletbeacon.io/wp-content/uploads/2021/03/beacon_logo-300x300.png',
  matrixNodes: ['beacon-node-1.sky.papers.tech'],
  name: 'Polkadot Example'
});

export const beaconSigner = new BeaconSigner(client);
