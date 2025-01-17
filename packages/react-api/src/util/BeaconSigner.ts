// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { BeaconMessageType, DAppClient, SubstrateBlockchain } from '@airgap/beacon-sdk';

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
    const response = await this.client.request({
      accountId: activeAccount.accountIdentifier,
      blockchainData: {
        mode: 'return',
        payload: {
          data: raw.data,
          dataType: raw.type,
          isMutable: false,
          type: 'raw'
        },
        scope: 'sign_payload_raw',
        type: 'sign_payload_request'
      },
      blockchainIdentifier: 'substrate',
      type: BeaconMessageType.BlockchainRequest
    } as any /* SubstrateSignPayloadRequest */);

    console.log('RESPONSE', response);

    return {
      id: 0,
      signature: (response.blockchainData as any).signature
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
