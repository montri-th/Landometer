(() => {
  const params = new URLSearchParams(location.search);
  const families = ["li.demand","li.supply","li.market_size","li.market_share","li.spending_readiness","li.demand_growth","li.accessibility","li.competitive_pressure","li.service_gap","li.cannibalization","li.occupancy_cost","li.unit_economics"];
  const family = params.get('family') || params.get('liFamily');
  const count = Number(params.get('n') || params.get('liN'));
  const vision = params.get('vision') || params.get('liVision');
  params.set('liFamily', families.includes(family) ? family : 'li.demand');
  params.set('liN', String([41,3,5,7,9].includes(count) ? count : 41));
  params.set('liVision', ['normal','deuteranopia','protanopia','gray'].includes(vision) ? vision : 'normal');
  for (const key of ['family','n','vision']) params.delete(key);
  const section = location.hash === '#roles' ? 'atlas-location-roles' : location.hash === '#scales' ? 'atlas-location-scales' : 'atlas-location-lab';
  location.replace('../?' + params.toString() + '#' + section);
})();
