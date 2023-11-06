import { runFixture, validFixtureNames } from './runFixture'

validFixtureNames.forEach((fixtureName) => {
	console.log(`Running fixture: ${fixtureName}\n\n`)
	runFixture(fixtureName)
})
