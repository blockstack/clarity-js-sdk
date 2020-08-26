import { Client, Provider, Receipt, Result } from '@blockstack/clarity';

export class NonFungibleTokenClient extends Client {
  constructor(provider: Provider) {
    super(
      'SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.non-fungible-token',
      'tokens/non-fungible-token',
      provider
    );
  }

  async balanceOf(owner: string): Promise<number> {
    const query = this.createQuery({ method: { name: 'balance-of', args: [`'${owner}`] } });
    const res = await this.submitQuery(query);
    return parseInt(res.result as string);
  }

  async ownerOf(tokenId: number): Promise<string> {
    const query = this.createQuery({ method: { name: 'owner-of?', args: [`${tokenId}`] } });
    const res = await this.submitQuery(query);
    return Result.unwrap(res).replace(/'/g, '');
  }

  async canTransfer(actor: string, tokenId: number): Promise<boolean> {
    const query = this.createQuery({
      method: { name: 'can-transfer', args: [`'${actor}`, `${tokenId}`] },
    });
    const res = await this.submitQuery(query);
    return Result.unwrap(res) === 'true';
  }

  async isSpenderApproved(spender: string, tokenId: number): Promise<number> {
    const query = this.createQuery({
      method: { name: 'is-spender-approved', args: [`'${spender}`, `${tokenId}`] },
    });
    const res = await this.submitQuery(query);
    return parseInt(Result.unwrap(res));
  }

  async isOperatorApproved(owner: string, operator: string): Promise<number> {
    const query = this.createQuery({
      method: { name: 'is-operator-approved', args: [`'${owner}`, `'${operator}`] },
    });
    const res = await this.submitQuery(query);
    return parseInt(Result.unwrap(res));
  }

  async setSpenderApproval(
    spender: string,
    tokenId: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: 'set-spender-approval', args: [`'${spender}`, `${tokenId}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async setOperatorApproval(
    operator: string,
    isApproved: boolean,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: 'set-operator-approval', args: [`'${operator}`, `${isApproved}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async transferFrom(
    from: string,
    to: string,
    tokenId: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: 'transfer-from', args: [`'${from}`, `'${to}`, `${tokenId}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async transfer(to: string, tokenId: number, params: { sender: string }): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: 'transfer', args: [`'${to}`, `${tokenId}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }
}
