// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DAppClient, SubstrateBlockchain } from '@airgap/beacon-sdk';

import { Signer } from '@polkadot/api/types';
import { SignerPayloadRaw, SignerResult } from '@polkadot/types/types/extrinsic';

export class BeaconSigner implements Signer {
  private readonly client: DAppClient;

  constructor (client: DAppClient) {
    this.client = client;
  }

  // async signPayload (_payload: SignerPayloadJSON): Promise<SignerResult> {
  //   console.log('SIGN PAYLOAD INVOKED', _payload);
  //   // TODO: Implement signPayload

  //   // Fix linter error
  //   await new Promise(() => undefined);

  //   return {
  //     id: 0,
  //     signature: '0x'
  //   };
  // }

  async signRaw (raw: SignerPayloadRaw): Promise<SignerResult> {
    console.log('SIGN RAW INVOKED', raw);

    // const signature = await this.client.requestSignPayload({
    //   payload: raw.data
    // });

    const activeAccount = await this.client.getActiveAccount();

    if (!activeAccount) {
      throw new Error('Beacon not set up.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const signature = await this.client.request({
      blockchainData: {
        address: activeAccount.address,
        metadata: {
          genesisHash: '',
          runtimeVersion: '',
          transactionVersion: ''
        },
        mode: 'return',
        payload: raw.data,
        scope: 'sign_raw'
      },
      blockchainIdentifier: 'substrate',
      type: 'blockchain_request'
    } as any);

    return {
      id: 0,
      signature: (signature.blockchainData as any).signature
    };
  }
}

export const client = new DAppClient({
  matrixNodes: ['beacon-node-1.sky.papers.tech'],
  name: 'Polkadot Example'
});

const substrateBlockchain = new SubstrateBlockchain();

client.addBlockchain(substrateBlockchain);

export const beaconSigner = new BeaconSigner(client);
