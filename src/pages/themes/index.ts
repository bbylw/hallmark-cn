import type { ThemePage } from '../../data/pages'
import { AlmanacPage } from './almanac'
import { AtelierPage } from './atelier'
import { AuroraPage } from './aurora'
import { BloomPage } from './bloom'
import { BrutalPage } from './brutal'
import { CarnivalPage } from './carnival'
import { CobaltPage } from './cobalt'
import { CoralPage } from './coral'
import { EditorialPage } from './editorial'
import { GardenPage } from './garden'
import { GridPage } from './grid'
import { HumPage } from './hum'
import { LumenPage } from './lumen'
import { ManifestoPage } from './manifesto'
import { MidnightPage } from './midnight'
import { NewsprintPage } from './newsprint'
import { RisoPage } from './riso'
import { SpecimenPage } from './specimen'
import { SportPage } from './sport'
import { StudioPage } from './studio'
import { TerminalPage } from './terminal'

/** 21 个主题页，每页一个独立组件、一个只属于它的装置。 */
export const THEME_PAGE_COMPONENTS: Record<
  string,
  (p: { page: ThemePage }) => React.ReactElement
> = {
  grid: GridPage,
  specimen: SpecimenPage,
  midnight: MidnightPage,
  brutal: BrutalPage,
  garden: GardenPage,
  atelier: AtelierPage,
  newsprint: NewsprintPage,
  terminal: TerminalPage,
  manifesto: ManifestoPage,
  almanac: AlmanacPage,
  sport: SportPage,
  studio: StudioPage,
  riso: RisoPage,
  bloom: BloomPage,
  coral: CoralPage,
  cobalt: CobaltPage,
  aurora: AuroraPage,
  editorial: EditorialPage,
  carnival: CarnivalPage,
  lumen: LumenPage,
  hum: HumPage,
}
