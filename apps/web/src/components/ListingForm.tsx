'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function ListingForm() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setSaved(false);
    setError('');
    const form = new FormData(event.currentTarget);
    const value = (name: string) => form.get(name)?.toString() || undefined;
    const number = (name: string) => { const raw = value(name); return raw ? Number(raw) : undefined; };
    const currency = value('currency');
    const financial = (name: string) => { const amount = number(name); return amount === undefined ? undefined : { amount, currency }; };
    try {
      await api.createListing({
        publicTitle: value('publicTitle'), shortSummary: value('shortSummary'), description: value('description'), industry: value('industry'),
        country: value('country'), region: value('region'), city: value('city'), yearsOperating: number('yearsOperating'), employeeRange: value('employeeRange'),
        productsAndServices: value('productsAndServices'), identityMode: value('identityMode'), legalBusinessName: value('legalBusinessName'),
        internalWebsite: value('internalWebsite'), internalNotes: value('internalNotes'), sellerMotivation: value('sellerMotivation'),
        revenue: financial('revenue'), ebitda: financial('ebitda'), sde: financial('sde'), askingPrice: financial('askingPrice')
      });
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save the draft');
    } finally { setBusy(false); }
  }

  return <form className="form-stack" onSubmit={submit}>
    <fieldset><legend>Business overview</legend><label>Public listing title<input required name="publicTitle" /></label><label>Short summary<textarea required name="shortSummary" maxLength={500} /></label><label>Detailed description<textarea name="description" /></label><label>Industry<input required name="industry" /></label></fieldset>
    <fieldset><legend>Location and operations</legend><div className="form-grid"><label>Country<input name="country" /></label><label>Region<input name="region" /></label><label>City<input name="city" /></label><label>Years operating<input type="number" min="0" name="yearsOperating" /></label><label>Employee range<input name="employeeRange" /></label></div><label>Products and services<textarea name="productsAndServices" /></label></fieldset>
    <fieldset><legend>Financial information</legend><p className="help-text">Enter available figures with their currency. Leave unknown values blank; do not enter zero for missing information.</p><div className="form-grid"><label>Currency<input name="currency" maxLength={3} placeholder="USD" /></label><label>Revenue<input type="number" min="0" name="revenue" /></label><label>EBITDA<input type="number" min="0" name="ebitda" /></label><label>SDE<input type="number" min="0" name="sde" /></label><label>Asking price<input type="number" min="0" name="askingPrice" /></label></div></fieldset>
    <fieldset><legend>Business identity</legend><label>Actual business name<input name="legalBusinessName" /></label><label>Internal website<input type="url" name="internalWebsite" /></label><div className="radio-row"><label><input type="radio" name="identityMode" value="ANONYMIZED" defaultChecked /> Anonymized</label><label><input type="radio" name="identityMode" value="IDENTIFIED" /> Identified</label></div><p className="help-text">Choose whether investors can see the actual business identity and approved website information.</p></fieldset>
    <fieldset><legend>Internal information</legend><p className="help-text">Information in this section is for authorized internal users and is not displayed in investor listings.</p><label>Internal notes<textarea name="internalNotes" /></label><label>Seller or transaction context<textarea name="sellerMotivation" /></label></fieldset>
    <div className="form-actions"><button className="button button-secondary" type="button">Cancel</button><button className="button" disabled={busy} type="submit">{busy ? 'Saving...' : 'Save draft'}</button>{saved && <span className="success-message">Draft saved successfully.</span>}{error && <span className="error-state" role="alert">{error}</span>}</div>
  </form>;
}
