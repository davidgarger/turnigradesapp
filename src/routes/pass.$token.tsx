import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { readSharedPass } from '@/lib/pass-shares.functions';
import { TurniPassSheet } from '@/components/TurniPassSheet';

const sharedPassQuery = (token: string) => queryOptions({ queryKey: ['shared-pass',token], queryFn: ()=>readSharedPass({data:{token}}), staleTime: 0, gcTime: 0, refetchInterval: 30000 });
export const Route = createFileRoute('/pass/$token')({
  loader: ({context,params})=>context.queryClient.ensureQueryData(sharedPassQuery(params.token)),
  component: SharedPassPage,
  head: ()=>({meta:[
    {title:'Turni-Pass Winter — Turni'},
    {name:'description',content:'Freigegebener Turni-Pass für Geräteturnen.'},
    {property:'og:title',content:'Turni-Pass Winter — Turni'},
    {property:'og:description',content:'Freigegebener Turni-Pass für Geräteturnen.'},
    {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary'},
    {name:'robots',content:'noindex, nofollow, noarchive'}, {name:'referrer',content:'no-referrer'},
  ]}),
});
function SharedPassPage() {
  const {token}=Route.useParams(); const {data}=useSuspenseQuery(sharedPassQuery(token));
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">{data ? <TurniPassSheet payload={data.payload} updatedAt={data.updatedAt}/> : <div className="py-16 text-center"><h1 className="text-xl font-bold">Dieser Pass ist nicht mehr freigegeben</h1></div>}</main>;
}